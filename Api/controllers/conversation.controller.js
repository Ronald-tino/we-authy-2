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

    // Determine correct roles using user records
    const [current, other] = await Promise.all([
      User.findById(req.userId).select("isSeller"),
      User.findById(req.body.to).select("isSeller"),
    ]);

    if (!current || !other) {
      return next(createError(404, "User not found for conversation"));
    }

    // IMPORTANT: In most cases, req.body.to is the gig owner (seller)
    // and req.userId is the person contacting them (buyer).
    // However, both could be sellers on the platform.
    // We assign roles based on who has seller status, preferring the "to" user as seller.
    let sellerId, buyerId;

    if (other.isSeller) {
      // The person being contacted is a seller, so they're the seller in this conversation
      sellerId = req.body.to;
      buyerId = req.userId;
    } else if (current.isSeller) {
      // Only the current user is a seller
      sellerId = req.userId;
      buyerId = req.body.to;
    } else {
      // Neither is a seller (edge case) - assign based on who initiated
      sellerId = req.body.to;
      buyerId = req.userId;
    }

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
    // Determine who the "other" user is (not the current user)
    const otherUserId =
      conversation.sellerId === req.userId
        ? conversation.buyerId
        : conversation.sellerId;
    console.log("Other user ID:", otherUserId);
    const otherUser = await User.findById(otherUserId).select(
      "username img country isSeller"
    );
    console.log("Other user data:", otherUser);

    const conversationWithUser = {
      ...conversation.toObject(),
      otherUser: otherUser
        ? {
            username: otherUser.username,
            img: otherUser.img,
            country: otherUser.country,
            isSeller: otherUser.isSeller,
          }
        : {
            username: "Unknown User",
            img: null,
            country: "Unknown",
            isSeller: false,
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
    // Find ALL conversations where user is either seller OR buyer
    // This ensures sellers can see all their conversations regardless of "mode"
    const conversations = await Conversation.find({
      $or: [{ sellerId: req.userId }, { buyerId: req.userId }],
    }).sort({ updatedAt: -1 });

    console.log(
      `Found ${conversations.length} conversations for user ${req.userId}`
    );

    // Populate user information for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conversation) => {
        // Determine who the "other" user is
        const otherUserId =
          conversation.sellerId === req.userId
            ? conversation.buyerId
            : conversation.sellerId;

        const otherUser = await User.findById(otherUserId).select(
          "username img country isSeller"
        );

        return {
          ...conversation.toObject(),
          otherUser: otherUser
            ? {
                username: otherUser.username,
                img: otherUser.img,
                country: otherUser.country,
                isSeller: otherUser.isSeller,
              }
            : {
                username: "Unknown User",
                img: null,
                country: "Unknown",
                isSeller: false,
              },
        };
      })
    );

    res.status(200).send(conversationsWithUsers);
  } catch (err) {
    console.error("Error getting conversations:", err);
    next(err);
  }
};
