import { ProductStore } from "../../models/product";
import { DashboardQueries } from "../dashboard";

const dashboard = new DashboardQueries();
const product_store = new ProductStore();

describe("Dashboard Service", () => {
  it("should have an fiveMostExpensive method", () => {
    expect(dashboard.fiveMostExpensive).toBeDefined();
  });

  it("fiveMostExpensive method should return 5 most expensive products", async () => {
    let pc = {
      id: 0,
      name: "Pc",
      price: 23300,
    };
    const mouse = {
      id: 0,
      name: "Mouse",
      price: 150,
    };

    let keyboard = {
      id: 0,
      name: "Keyboard",
      price: 2500,
    };

    let monitor = {
      id: 0,
      name: "Monitor",
      price: 3500,
    };

    let headphones = {
      id: 0,
      name: "Headphones",
      price: 2100,
    };

    let desk = {
      id: 0,
      name: "Desk",
      price: 200,
    };

    pc = await product_store.create(pc);

    await product_store.create(mouse);

    keyboard = await product_store.create(keyboard);

    monitor = await product_store.create(monitor);

    headphones = await product_store.create(headphones);

    desk = await product_store.create(desk);

    const result = await dashboard.fiveMostExpensive();
    expect(result).toEqual([pc, monitor, keyboard, headphones, desk]);
  });
});
