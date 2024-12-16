import * as mysql from 'mysql2/promise'
import Config from '@sulimantekalli/configlib'

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
    const mysqlConfig = {
      user: config.getField('MYSQL_CONFIG_USER'),
      password: config.getField('MYSQL_CONFIG_PASSWORD'),
      database: config.getField('MYSQL_CONFIG_DATABASE'),
      timezone: config.getField("MYSQL_CONFIG_TIMEZONE"),
      multipleStatements: true
    }
    this.connection = this.initConnection(mysqlConfig)
  }

  async initConnection(config: mySqlConfigIF): Promise<mysql.Connection> {
    return mysql.createPool(config)
  }

  async query(q: string, v?: string) {
    const connection = await this.connection
    return connection.query(q, v)
  }

}

export default MySQL