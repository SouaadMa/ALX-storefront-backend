import express, { Request, Response } from "express";

import { DashboardQueries } from "../services/dashboard";

const dashboard = new DashboardQueries();

const fiveMostExpensive = async (_req: Request, res: Response) => {
  const users = await dashboard.fiveMostExpensive();
  res.json(users);
};

const dashboardRoutes = (app: express.Application) => {
  app.get("/five-most-expensive", fiveMostExpensive);
};

export default dashboardRoutes;
