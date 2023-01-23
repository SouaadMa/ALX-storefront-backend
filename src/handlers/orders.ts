import express, { Request, Response } from "express";
import { Order, OrderStore } from "../models/order";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
type Next = () => void | Promise<void>;
const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.userid)
      throw new Error("userid is required to create an order");
    const order_to_create: Order = {
      id: 0,
      user_id: req.body.userid,
      status: "active",
    };
    const newOrder = await store.create(order_to_create);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderProduct = async (req: Request, res: Response) => {
  try {
    if (!req.params.id || !req.body.productid || !req.body.quantity)
      throw new Error(
        "orderid, productid and quantity are required to order a product"
      );
    const order = await store.addProduct(
      Number(req.params.id),
      req.body.productid,
      req.body.quantity
    );
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const currentOrderByUser = async (req: Request, res: Response) => {
  try {
    if (!req.params.userid)
      throw new Error("userid is required to show current order");
    const currentOrder = await store.currentOrderByUser(Number(req.params.userid));
    res.json(currentOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const completedOrdersByUser = async (req: Request, res: Response) => {
  try {
    if (!req.params.userid)
      throw new Error("userid is required to show current order");
    const completedOrders = await store.completedOrdersByUser(Number(req.params.userid));
    res.json(completedOrders);
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

const orderRoutes = (app: express.Application) => {
  app.get("/orders", index); 
  app.post("/orders", verifyAuthToken, create); 
  app.post("/orders/:id/products", verifyAuthToken, orderProduct); 
  app.get("/orders/:userid", verifyAuthToken, currentOrderByUser);
  app.get("/orders/complete/:userid", verifyAuthToken, completedOrdersByUser);
};

export default orderRoutes;
