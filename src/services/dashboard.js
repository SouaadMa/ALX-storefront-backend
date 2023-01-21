"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardQueries = void 0;
class DashboardQueries {
  // Get all users that have made orders
  async fiveMostExpensive() {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql = "SELECT * FROM products ORDER BY price DESC LIMIT 5";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get products by price: ${err}`);
    }
  }
}
exports.DashboardQueries = DashboardQueries;
