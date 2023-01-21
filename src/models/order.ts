// @ts-ignore
import client from "../database";

export type Order = {
  id: number;
  status: string;
  user_id: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [o.user_id, o.status]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not add new order ${o.id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async addProduct(order_id: number, product_id: number): Promise<Order> {
    try {
      const status = await this.checkStatus(order_id);

      if (status != "active") {
        throw new Error(`Order ${order_id} is ${status}, not active.`);
      }

      const sql =
        "INSERT INTO order_products (order_id, product_id) VALUES($1, $2) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [order_id, product_id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add new product ${product_id} to order ${order_id}. Error: ${err}`
      );
    }
  }

  async checkStatus(order_id: number): Promise<string> {
    try {
      const sql = "SELECT status FROM orders WHERE id=$1";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [order_id]);

      const status = result.rows[0];

      conn.release();

      return status;
    } catch (err) {
      throw new Error(`Could not select order ${order_id}. Error: ${err}`);
    }
  }

  // Get Current Order by user (args: user id)
  async currentOrderByUser(user_id: number): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE user_id=$1 AND status=$2";

      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [user_id, "active"]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Unable to get active order of user ${user_id}: ${err}`);
    }
  }

  // Get Completed Orders by user (args: user id)
  async completedOrdersByUser(user_id: number): Promise<Order[]> {
    try {
      const sql = "SELECT * FROM orders WHERE user_id=$1 AND status=$2";

      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [user_id, "closed"]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get closed orders of user ${user_id}: ${err}`);
    }
  }
}
