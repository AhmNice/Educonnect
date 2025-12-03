import express from "express"
import { approveAllGroupRequest, ApproveGroupRequest, DeclineGroupRequest, GetGroupRequests, RequestJoinGroup } from "../controller/request.controller.js"
const requestRoute = express.Router()

requestRoute.post("/request-to-join", RequestJoinGroup)
requestRoute.get("/request-list/:group_id",GetGroupRequests)
requestRoute.patch("/approve-group-request", ApproveGroupRequest)
requestRoute.patch("/decline-group-request", DeclineGroupRequest)
requestRoute.patch("/bulk-approve",approveAllGroupRequest);
export default requestRoute