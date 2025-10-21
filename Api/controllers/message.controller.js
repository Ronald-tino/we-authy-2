import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createMessage = async (req, res, next) => {
  console.log("Creating message with:", {
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
    isSeller: req.isSeller,
  });

  // Check if conversation exists
  const conversation = await Conversation.findOne({
    id: req.body.conversationId,
  });
  console.log("Conversation found:", conversation);

  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });

  try {
    const savedMessage = await newMessage.save();
    console.log("Message saved:", savedMessage);

    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    console.log("Updated conversation:", updatedConversation);

    res.status(201).send(savedMessage);
  } catch (err) {
    console.error("Error creating message:", err);
    next(err);
  }
};
export const getMessages = async (req, res, next) => {
  try {
    console.log("Getting messages for conversation ID:", req.params.id);
    let messages = await Message.find({ conversationId: req.params.id }).sort({
      createdAt: 1,
    });

    // If no messages found with the given ID, try to find with alternative formats
    if (messages.length === 0) {
      console.log(
        "No messages found with given ID, trying alternative formats..."
      );

      // Try to find conversation first to get the correct ID
      const conversation = await Conversation.findOne({ id: req.params.id });
      if (conversation) {
        console.log(
          "Found conversation, searching for messages with conversation ID:",
          conversation.id
        );
        messages = await Message.find({ conversationId: conversation.id }).sort(
          { createdAt: 1 }
        );
      } else {
        // Try old format - look for messages with concatenated IDs
        const userIds = req.params.id.split("_");
        if (userIds.length === 2) {
          // New format with underscore
          messages = await Message.find({ conversationId: req.params.id }).sort(
            { createdAt: 1 }
          );
        } else {
          // Old format - try different combinations
          const possibleIds = [
            req.params.id,
            req.userId + req.params.id.replace(req.userId, ""),
            req.params.id.replace(req.userId, "") + req.userId,
          ];

          for (const possibleId of possibleIds) {
            messages = await Message.find({ conversationId: possibleId }).sort({
              createdAt: 1,
            });
            if (messages.length > 0) {
              console.log("Found messages with alternative ID:", possibleId);
              break;
            }
          }
        }
      }
    }

    console.log("Found messages:", messages);
    res.status(200).send(messages);
  } catch (err) {
    console.error("Error getting messages:", err);
    next(err);
  }
};
