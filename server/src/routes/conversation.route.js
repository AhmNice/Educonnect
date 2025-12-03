import express from 'express'
import { fetchConversations, getUserConversations } from '../controller/conversation.controller.js'
import { fetchMessages } from '../controller/message.controller.js'
const conversationRoute = express.Router()

conversationRoute.get("/all-conversation", fetchConversations)
conversationRoute.get("/get-user-conversations/:user_id", getUserConversations)
conversationRoute.get("/fetch-conversation-messages/:conversation_id", fetchMessages)
export default conversationRoute