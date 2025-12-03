import express from 'express'
import { singleUpload } from '../middleware/fileUploader.js'
import { addResources, deleteResourceById, downloadResource, getAllResources, getResourceById } from '../controller/resource.controller.js'
import { verifySession } from '../util/session.js'
const resourceRoute = express.Router()
resourceRoute.post("/add-resource", verifySession, singleUpload, addResources)
resourceRoute.get("/fetch-all-resources", verifySession, getAllResources)
resourceRoute.delete("/delete-resource/:resource_id/:user_id", verifySession, deleteResourceById)
resourceRoute.get("/get-resource/:resource_id", verifySession, getResourceById)
resourceRoute.get("/download-resource/:resource_id", verifySession, downloadResource)
export default resourceRoute