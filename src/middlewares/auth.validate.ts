import joi from "joi"
export const validateRegister = async (req: any, res: any, next: any) => {
  const { email, role, password, name } = req.body;
  if (
    !name ||
    !email ||
    !role ||
    !password ||
    email === "" ||
    role === "" ||
    password === "" ||
    name === ""
  ) {
    await res.status(403).json({
      error:
        "please provide email, role,name, password to register the user",
    });
    return;
  }
  const joiCreateUserSchema = joi.object({email: joi.string()
  .email()
  .min(5)
  .max(50), role: joi.string().valid("admin").valid("user")})
  if (joiCreateUserSchema.validate({email:email, role:role}).error){
    return await res.status(403).json({error:"please provide valid role and email address, available roles are 'admin' and 'user'"})
  };
  return next()
};

export const validateLogin = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return await res.status(403).json({
      error: "please provide username, password to login the user",
    });
  }
  return next();
};

export const isAuthorized = (role: string, allowedRoles: Array<string>) => {
  if (allowedRoles.includes(role)) {
    return true;
  } else {
    return false;
  }
};
