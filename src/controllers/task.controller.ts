import Task from "../models/task.model";
import { v4 } from "uuid";
import Audit from "../models/audit.model";
import { sendEmail } from "../utils/mail";
import User from "../models/user.model";
export const createTask = async (req: any, res: any) => {
  try {
    const { title, description, dueDate, assignees } = req.body;
    const id = v4();
    const checkIfTitleExists = await Task.findOne({ title });
    if (checkIfTitleExists)
      return res.status(409).json({
        message:
          "A task with the above title already exists,please use a different title",
      });
    const createtask = await Task.create({
      id,
      title,
      description,
      status: "pending",
      dueDate,
      assignees,
    });
    assignees.push(req.user.id);
    await Audit.create({ userId: req.user.id, actionType: "create_task" });
    const userToEmails = await User.find(
      { id: { $in: assignees } },
      { email: 1 }
    );
    const messageData = {
      to: userToEmails,
      subject: `Task got created with title ${title}`,
      text: `${req.user.name} created a task`,
    };
    const emailResponse = await sendEmail(messageData);
    console.log("email response", emailResponse);

    const createTaskResponse = {
      id: createtask.id,
      title: createtask.title,
      status: "pending",
      assignees: createtask.assignees,
    };
    return res.status(200).json(createTaskResponse);
  } catch (error) {
    console.error("Error occoured to create task", error);
    return res.status(500).json({ error: "error occoured to create task" });
  }
};

export const getTasks = async (req: any, res: any) => {
  try {
    const userRole = req.user.role;
    let tasks = [];
    let filterObj: any = {};

    if (userRole === "admin") {
      if (req.query.search && req.query.search !== null) {
        filterObj["title"] = { $regex: req.query.search, $options: "i" };
      }

      if (req.query.status && req.query.status !== null) {
        filterObj["status"] = { $regex: req.query.status, $options: "i" };
      }
      console.log("filter obj", JSON.stringify(filterObj));

      tasks = await Task.find(filterObj, {
        title: 1,
        id: 1,
        _id: 0,
        description: 1,
        status: 1,
        dueDate: 1,
        assignees: 1,
        creator: 1,
      })
        .skip(req.query.page - 1)
        .limit(req.query.limit);
      await Audit.create({ userId: req.user.id, actionType: "get_tasks" });
    } else {
      if (req.query.search && req.query.search !== null) {
        filterObj["title"] = { $regex: req.query.search, $options: "i" };
      }

      if (req.query.status && req.query.status !== null) {
        filterObj["status"] = { $regex: req.query.status, $options: "i" };
      }
      tasks = await Task.find(
        { ...filterObj, creator: req.user.id },
        {
          title: 1,
          id: 1,
          _id: 0,
          description: 1,
          status: 1,
          dueDate: 1,
          assignees: 1,
          creator: 1,
        }
      );
      await Audit.create({ userId: req.user.id, actionType: "get_tasks" });
    }

    return res
      .status(200)
      .json({ message: "successfully fetched tasks list", data: tasks });
  } catch (error) {
    console.error("Error occoured to fetch tasks list", error);
    return res
      .status(500)
      .json({ error: "Error occoured to fetch tasks list" });
  }
};

export const getTaskById = async (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const taskDetails = await Task.findOne(
      { id: taskId },
      {
        id: 1,
        _id: 0,
        title: 1,
        description: 1,
        status: 1,
        dueDate: 1,
        creator: 1,
        assignees: 1,
      }
    );
    await Audit.create({ userId: req.user.id, actionType: "get_task_by_id" });
    return res.status(200).json({
      message: "successfully fetched task details",
      data: taskDetails,
    });
  } catch (error) {
    console.error("Error occoured to fetch task by id", error);
    return res
      .status(500)
      .json({ error: "Error occoured to fetch task by id" });
  }
};

export const updateTask = async (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const { title, status, description, dueDate, assignees } = req.body;
    if (req.user.role === "admin") {
      await Task.findOneAndUpdate(
        { id: taskId },
        {
          $set: {
            title: title,
            status: status,
            description: description,
            dueDate: dueDate,
            assignees: assignees,
          },
        }
      );
      await Audit.create({ userId: req.user.id, actionType: "update_task" });
      assignees.push(req.user.id);
      const userToEmails = await User.find(
        { id: { $in: assignees } },
        { email: 1 }
      );
      const messageData = {
        to: userToEmails,
        subject: `Task  with id ${req.params.id} got Updated with title ${title}`,
        text: `${req.user.name} updated a task with id ${req.params.id}`,
      };
      const emailResponse = await sendEmail(messageData);
      console.log("update response", emailResponse);
      
    } else {
      await Task.findOneAndUpdate(
        { id: taskId, creator: req.user.id },
        {
          $set: {
            title: title,
            status: status,
            description: description,
            dueDate: dueDate,
            assignees: assignees,
          },
        }
      );
      await Audit.create({ userId: req.user.id, actionType: "update_task" });
      const userToEmails = await User.find(
        { id: { $in: assignees } },
        { email: 1 }
      );
      const messageData = {
        to: userToEmails,
        subject: `Task  with id ${req.params.id} got Updated with title ${title}`,
        text: `${req.user.name} created a task`,
      };
      const emailResponse = await sendEmail(messageData);
      console.log("email response else", emailResponse);
      
    }

    return res.status(202).json({ message: "Successfully updated task" });
  } catch (error) {
    console.error("error occoured to update task");
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const taskData = await Task.findOne(
      { id: req.params.id },
      { assignees: 1, _id: 0, id: 1, title:1}
    );
    const assignees:any = taskData?.assignees
    const title: any = taskData?.title 
    if (req.user.role === "admin") {
      await Task.findOneAndDelete({ id: taskId });
      await Audit.create({ userId: req.user.id, actionType: "delete_task" });
      assignees.push(req.user.id);
      const userToEmails = await User.find(
        { id: { $in: assignees } },
        { email: 1 }
      );
      const messageData = {
        to: userToEmails,
        subject: `Task  with id ${req.params.id} got deleted with title ${title}}`,
        text: `${req.user.name} deleted a task called ${title}`,
      };
      const emailResponse = await sendEmail(messageData);
      return res.status(202).json({ message: "Successfully deleted task" });
    } else {
      await Task.findOneAndDelete({ id: taskId, creator: req.user.id });
      await Audit.create({ userId: req.user.id, actionType: "delete_task" });
      return res.status(202).json({ message: "Successfully deleted task" });
    }
  } catch (error) {
    console.error("Error occoured to delete task", error);
    return res.status(500).json({ error: "Error occured to delete task" });
  }
};
