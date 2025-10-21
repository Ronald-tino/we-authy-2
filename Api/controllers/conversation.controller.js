import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createConversation = async (req, res, next) => {
  // Create a consistent conversation ID by sorting the user IDs
  const userIds = [req.userId, req.body.to].sort();
  const conversationId = userIds.join("_");

  console.log("Creating conversation with ID:", conversationId);
  console.log("User IDs:", userIds);
  console.log("Is seller:", req.isSeller);

  try {
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      id: conversationId,
    });
    if (existingConversation) {
      console.log("Conversation already exists:", existingConversation);
      return res.status(200).send(existingConversation);
    }

    // Determine correct roles using user records (robust regardless of initiator)
    const [current, other] = await Promise.all([
      User.findById(req.userId).select("isSeller"),
      User.findById(req.body.to).select("isSeller"),
    ]);

    if (!current || !other) {
      return next(createError(404, "User not found for conversation"));
    }

    const sellerId = current.isSeller ? req.userId : req.body.to;
    const buyerId = sellerId === req.userId ? req.body.to : req.userId;

    const newConversation = new Conversation({
      id: conversationId,
      sellerId,
      buyerId,
      readBySeller: req.userId === sellerId,
      readByBuyer: req.userId === buyerId,
    });

    const savedConversation = await newConversation.save();
    console.log("New conversation created:", savedConversation);
    res.status(201).send(savedConversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    console.log("Getting conversation for ID:", req.params.id);
    let conversation = await Conversation.findOne({ id: req.params.id });

    // If not found with new format, try old format
    if (!conversation) {
      console.log(
        "Conversation not found with new format, trying old format..."
      );
      // Try to find with old format (concatenated IDs)
      const conversations = await Conversation.find({
        $or: [
          { id: req.params.id },
          {
            sellerId: req.userId,
            buyerId: req.params.id.replace(req.userId, ""),
          },
          {
            buyerId: req.userId,
            sellerId: req.params.id.replace(req.userId, ""),
          },
        ],
      });

      if (conversations.length > 0) {
        conversation = conversations[0];
        console.log("Found conversation with old format:", conversation);
      }
    }

    console.log("Found conversation:", conversation);
    if (!conversation) return next(createError(404, "Not found!"));

    // Get the other user's information
    const otherUserId = req.isSeller
      ? conversation.buyerId
      : conversation.sellerId;
    console.log("Other user ID:", otherUserId);
    const otherUser = await User.findById(otherUserId).select(
      "username img country"
    );
    console.log("Other user data:", otherUser);

    const conversationWithUser = {
      ...conversation.toObject(),
      otherUser: otherUser
        ? {
            username: otherUser.username,
            img: otherUser.img,
            country: otherUser.country,
          }
        : {
            username: "Unknown User",
            img: null,
            country: "Unknown",
          },
    };

    res.status(200).send(conversationWithUser);
  } catch (err) {
    console.error("Error getting conversation:", err);
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });

    // Populate user information for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId = req.isSeller
          ? conversation.buyerId
          : conversation.sellerId;
        const otherUser = await User.findById(otherUserId).select(
          "username img country"
        );

        return {
          ...conversation.toObject(),
          otherUser: otherUser
            ? {
                username: otherUser.username,
                img: otherUser.img,
                country: otherUser.country,
              }
            : {
                username: "Unknown User",
                img: null,
                country: "Unknown",
              },
        };
      })
    );

    res.status(200).send(conversationsWithUsers);
  } catch (err) {
    next(err);
  }
};
