import User from "../models/user.model";
import bcrypt from "bcryptjs";
import addNewToken from "../utils/token";
import { v4 } from "uuid";
import { isAuthenticate } from "../middlewares/isAuthenticate";
// import {random} from "./todo.controller"
// controller to register new user
export const register = async (req: any, res: any) => {
  const { ...authBody } = req.body;
  const { email = null } = authBody;
  console.log("req user", req.user);
  const isAuthorized = req.user?.role === 'admin' || ( authBody.role === 'admin');

  if (!isAuthorized) {
    return res.status(403).json({ message: "Only admin users are allowed to create users" });
  }
  const userIfExists = await User.findOne({ email });
  const id = v4();
  if (userIfExists) {
    return res.status(409).json({ error: "user already exists please login" });
  }
  const password = authBody.password
    ? { password: await bcrypt.hash(authBody.password, 10) }
    : {};

  delete authBody.password;

  const createUser = await User.create({
    id,
    email,
    ...password,
    ...authBody,
  });

  if (!createUser) {
    return res
      .status(500)
      .json({ error: "unable to register user please try again later" });
  }

  const userCreateResponse = {
    email: createUser.email,
    role: createUser.role,
    name: createUser.name,
    id: createUser.id,
  };
  res.status(200).json({
    message: "User created successfully",
    user: userCreateResponse,
  });
};

// Function to login
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const userIfExists: any = await User.findOne({ email });
  if (!userIfExists) {
    return res.status(500).json({ error: "invalid username" });
  }

  const isMatch = await bcrypt.compare(password, userIfExists?.password);
  if (!isMatch) {
    return res
      .status(409)
      .json({ status: "forbidden", message: "Password doesn't match!" });
  }

  const getUser: any = await User.findById(userIfExists._id);
  if (!getUser) {
    return res.status(404).json({
      status: "error",
      message: `User not found please register to continue`,
    });
  }

  addNewToken(req, res, getUser);
  const { refresh = "", access = "" } = res.locals;
  return res.status(200).json({
    status: "success",
    message: "Login Successful.",
    access,
    refresh,
  });
};

export const getUsers = async (req:any, res:any) => {
    try {
        const usersData = await User.find({}, {name:1,_id:0, id:1,email:1, role:1})
        return res.status(200).json({"message":"successfully fetched users data", "data":usersData})
    } catch (error) {
        console.error("Error occoured to fetch sers list", error);
        return res.status(500).json({"error":"Error occoured to fetch users", "error message":error})
    }
}