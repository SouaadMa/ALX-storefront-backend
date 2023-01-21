// @ts-ignore
import Client from '../database'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
const pepper = process.env.SALT_ROUNDS

export type User = {
     id: Number;
     firstName: String;
     lastName: String;
     password: String;
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM users'
  
      const result = await conn.query(sql)
  
      conn.release()
  
      return result.rows 
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async show(id: Number): Promise<User> {
    try {
    const sql = 'SELECT * FROM users WHERE id=($1)'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn.query(sql, [id])

    conn.release()

    return result.rows[0]
    } catch (err) {
        throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }

  async create(u: User): Promise<User> {
      try {
    const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'
    // @ts-ignore
    const conn = await Client.connect()
    
    const hash = bcrypt.hashSync( u.password + pepper,parseInt(saltRounds));

    const result = await conn
        .query(sql, [u.firstName, u.lastName, hash])

    const user = result.rows[0]

    conn.release()

    return user
      } catch (err) {
          throw new Error(`Could not add new user ${title}. Error: ${err}`)
      }
  }
    
  async authenticate(firstName: string, lastName: string, password: string): Promise<User | null> {
      try {
    const sql = 'SELECT password FROM users WHERE firstName=($1) AND lastName=($2)'
    // @ts-ignore
    const conn = await Client.connect()

    const result = await conn.query(sql, [firstName, lastName])
    
    console.log(password+pepper)

    if (result.rows.length > 0) {
        const user = result.rows[0]
        console.log(user)
        if(bcrypt.compareSync(password+pepper, user.password)) {
            return user
        }
    }

    conn.release()

    return user
      } catch (err) {
          throw new Error(`Could not authenticate user ${firstName} ${lastName}. Error: ${err}`)
      }
  }


}