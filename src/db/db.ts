import * as mysql from 'mysql2/promise'

export interface mySqlConfigIF {
  user: string
  password: string
  database: string
  timezone: string
  multipleStatements: boolean
}


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