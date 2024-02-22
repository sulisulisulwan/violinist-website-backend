export interface mySqlConfigIF {
  user: string
  password: string
  database: string
  timezone: string
  multipleStatements: boolean
}

const config: mySqlConfigIF = {
  user: '',
  password: '',
  database: 'violinistWebsite',
  timezone: 'Z',
  multipleStatements: true
}

export default config