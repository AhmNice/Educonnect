import { Conversation } from "../model/Conversation.js";
import { Message } from "../model/Message.js"

export const saveMessage = async (req, res) => {
  const {
    conversation_id,
    sender_id,
    message_text,
  } = req.body
  try {
    const message = await new Message({
      conversation_id,
      sender_id,
      message_text,
      message_type: "text"
    }).save();
    return res.status(200).json({
      success: true,
      message: "message saved",
      message
    })
  } catch (error) {
    console.log("Error trying to save message");
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const fetchMessages = async (req, res) => {
  const { conversation_id } = req.params;

  try {
    const conversation = await Conversation.getFullConversation(conversation_id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully",
      conversation
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
export const fetchUnreadMessage = async (conversation_id, user_id)=>{
  if(!conversation_id || !user_id){
    throw new Error("Missing required fields");
  }
  try {
    const unreadMessages = await Message.getUnreadMessages(conversation_id, user_id);
  } catch (error) {

  }
}