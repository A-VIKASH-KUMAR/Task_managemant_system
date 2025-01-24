import Task from "../models/task.model"
import { v4 } from "uuid"
export const createTask = async (req:any, res:any) => {
    try {
        const {title, description, dueDate, assignees} = req.body
        const id = v4()
        const checkIfTitleExists = await Task.findOne({title})
        if (checkIfTitleExists) return res.status(409).json({"message":"A task with the above title already exists,please use a different title"})
        const createtask = await Task.create({id, title, description, status:"pending", dueDate, assignees})
        const createTaskResponse = {id:createtask.id, title:createtask.title, status:"pending", assignees:createtask.assignees}
        return res.status(200).json(createTaskResponse)
    } catch (error) {
        console.error("Error occoured to create task",error);
        return res.status(500).json({"error":"error occoured to create task"})
    }
}