import express, { Request, Response } from "express";

import { DashboardQueries } from "../services/dashboard";

const dashboard = new DashboardQueries();

const fiveMostExpensive = async (_req: Request, res: Response) => {
  try {
    const users = await dashboard.fiveMostExpensive();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(400);
  }
};

const dashboardRoutes = (app: express.Application) => {
  app.get("/five-most-expensive", fiveMostExpensive);
};

export default dashboardRoutes;
