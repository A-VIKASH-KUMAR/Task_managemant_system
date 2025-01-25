import { access } from "fs";
import jwt from "jsonwebtoken";

interface UserData {
  id?: string;
  email?: string;
  role:string;
  name:string;
}

type Request = {
  user: UserData;
};

export default function (req: Request, res: any, userData: UserData) {
  let jwtSignValue: any = {
    id: userData.id,
    email: userData.email,
    name:userData.name,
    role:userData.role
  };

  let accessToken = jwt.sign(jwtSignValue, process.env.JWT_SECRET_KEY!, {
    expiresIn: "5m",
  });

  let refreshToken = jwt.sign(jwtSignValue, process.env.JWT_SECRET_KEY!, {
    expiresIn: "24h",
  });

  // Attach tokens to the response locals object for further use
  res.locals.access = accessToken;
  res.locals.refresh = refreshToken;

  req.user = jwtSignValue;
}
