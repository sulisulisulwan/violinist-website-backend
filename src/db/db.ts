import * as mysql from 'mysql2/promise'
import Config from '../config/Config.js'

export interface mySqlConfigIF {
  user: string
  password: string
  database: string
  timezone: string
  multipleStatements: boolean
}

class MySQL {

  protected connection: Promise<mysql.Connection>

  constructor(config: Config) {
    this.connection = this.initConnection(config.getField('MYSQL_CONFIG'))
  }

  async initConnection(config: mySqlConfigIF): Promise<mysql.Connection> {
    return mysql.createPool(config)
  }

  async query(q: string, v?: string) {
    const connection = await this.connection
    return connection.query(q, v)
  }

}

const config = new Config()
const db = new MySQL(config)

export default db