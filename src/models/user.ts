// @ts-ignore
import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  async index(): Promise<
    { id: number; firstname: string; lastname: string }[]
  > {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT id, firstName, lastName FROM users";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(
    id: number
  ): Promise<{ id: number; firstname: string; lastname: string }> {
    try {
      const sql = "SELECT id, firstName, lastName FROM users WHERE id=($1)";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(
    u: User
  ): Promise<{ id: number; firstName: string; lastName: string } | null> {
    try {
      const sql =
        "INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING id, firstName, lastName";
      // @ts-ignore
      const conn = await client.connect();

      if (!pepper || !SALT_ROUNDS) {
        throw new Error(`Pepper and Salt rounds are required.`);
      }

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(SALT_ROUNDS));

      const result = await conn.query(sql, [u.firstName, u.lastName, hash]);

      const user = result.rows[0];

      conn.release();

      return {
        id: user.id,
        firstName: user.firstname,
        lastName: user.lastname,
      };
    } catch (err) {
      throw new Error(`Could not add new user ${u.firstName}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id = $1";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(
    firstName: string,
    lastName: string,
    password: string
  ): Promise<{ id: number; firstname: string; lastname: string } | null> {
    try {
      const sql = "SELECT * FROM users WHERE firstName=($1) AND lastName=($2)";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [firstName, lastName]);

      if (!pepper || !SALT_ROUNDS) {
        throw new Error(`Pepper and Salt rounds are required.`);
      }

      // console.log(password+pepper)

      if (result.rows.length > 0) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
          };
        }
      }

      conn.release();

      return null;
    } catch (err) {
      throw new Error(
        `Could not authenticate user ${firstName} ${lastName}. Error: ${err}`
      );
    }
  }
}
