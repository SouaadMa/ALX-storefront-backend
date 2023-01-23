import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
type Next = () => void | Promise<void>;
const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.name || !req.body.price)
      throw new Error("Name and price are required to create a product");
    const product: Product = req.body;
    const newProduct = await store.create(product);
    res.json(newProduct);
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

const productRoutes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
};

export default productRoutes;
