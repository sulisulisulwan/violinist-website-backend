import * as mysql from 'mysql2/promise'
import Config from '@sulimantekalli/configlib'
import configPaths from '../configPaths.js'

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
    console.log(config)
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

const config = new Config(configPaths)
const db = new MySQL(config)

export default db