import { Conversation } from "../model/Conversation.js"

export const fetchConversations = async (req, res) => {
  try {
    const conversations = await Conversation.getAll()
    return res.status(200).json({
      conversations
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "internal server error"
    })
  }
}
export const getUserConversations = async (req, res) => {
  const { user_id } = req.params
  try {
    const conversations = await Conversation.getUserConversations(user_id);
    return res.status(200).json({
      success: true,
      message: "Conversation fetched",
      conversations
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "internal server error"
    })
  }
}
