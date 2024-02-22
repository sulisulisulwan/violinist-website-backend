import * as mysql from 'mysql2/promise'
import { mySqlConfigIF } from './config'

class MySQL {

  protected connection: Promise<mysql.Connection>

  constructor(config: mySqlConfigIF) {
    this.connection = this.initConnection(config)
  }

  async initConnection(config: mySqlConfigIF): Promise<mysql.Connection> {
    return mysql.createConnection(config)
  }

  async query(q: string, v?: string) {
    const connection = await this.connection
    return connection.query(q, v)
  }

}


export default MySQL