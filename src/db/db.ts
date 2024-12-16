import config from '../configPaths.js'
import MySQL from './MySQL.js'

type DB = MySQL
const db = new MySQL(config)

export { DB }
export default db