import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserStore, User } from "../models/user";
dotenv.config();
type Next = () => void | Promise<void>;
const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(Number(req.params.id));
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.firstname || !req.body.lastname || !req.body.password)
      throw new Error(
        "firstname, lastname and password are required to create a user"
      );
    const user: User = req.body;
    const newUser = await store.create(user);
    res.json(newUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    if (!req.body.firstname || !req.body.lastname || !req.body.password)
      throw new Error(
        "firstname, lastname and password are required to authenticate as a user"
      );
    const user: User = req.body;
    const result = await store.authenticate(
      user.firstname,
      user.lastname,
      user.password
    );

    if (result) {
      const token = jwt.sign(
        { id: user.id },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: 86400, // 24 hours
        }
      );
      res.json({
        id: result.id,
        firstname: result.firstname,
        lastname: result.lastname,
        token: token,
      });
    } else {
      res.status(404);
      res.json("Authentication failed");
      return;
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

const verifyAuthToken = (req: Request, res: Response, next: Next) => {
  try {
    //Accesing the header
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader == null)
      throw new Error("authorizationHeader is undefined!");
    const token = authorizationHeader.split(" ")[1]; // to separate the bearer
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};

const userRoutes = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", create);
  app.post("/users/login", authenticate); // to get token for tests
};

export default userRoutes;
