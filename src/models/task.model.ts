import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    id:{
        type: String,
        required:true,
        inique:true
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed"]
    },
    dueDate: {
        type: Date
    },
    creator: {
        ref: "User",
        type: String
    },
    assignees: {
        ref: "User",
        type: Array<String>
    }

})

const task = mongoose.model("Task", taskSchema)

export default task
