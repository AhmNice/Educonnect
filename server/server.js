import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { connect_to_database } from './src/database/db_connection.js'
import cookieParser from 'cookie-parser'
import authRoute from './src/routes/auth.route.js'
import universityRoute from './src/routes/university.route.js'
import courseRoute from './src/routes/course.route.js'
import groupRoute from './src/routes/group.route.js'
import resourceRoute from './src/routes/resource.route.js'
import http from "http"
import { initSocketServer } from './src/config/socket.io_config.js'
import conversationRoute from './src/routes/conversation.route.js'
import requestRoute from './src/routes/request.route.js'
import statsRoute from './src/routes/stats.route.js'
import logRoute from './src/routes/activityLog.route.js'
import reportRoute from './src/routes/report.route.js'
dotenv.config()
const app = express()
const server = http.createServer(app);
initSocketServer(server)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.get('/', (req, res) => {
  res.send("✅ server is active 🌐")
})
app.set('trust proxy', true)
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

// routes
app.use('/auth', authRoute);
app.use('/auth/university', universityRoute)
app.use('/auth/course', courseRoute)
app.use("/auth/group", groupRoute)
app.use('/auth/resource', resourceRoute)
app.use('/auth/conversation', conversationRoute)
app.use('/auth/request', requestRoute)
app.use("/auth/stats", statsRoute)
app.use("/auth/log", logRoute)
app.use("/auth/reports", reportRoute)
const start_server = async () => {
  console.log("🔃 starting server ....");
  try {
    await connect_to_database()
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server with socket.io is running on port ${process.env.PORT}`);
    })
  } catch (error) {
    console.log("❌ error trying to connect to server", error.message)
  }
}
start_server()