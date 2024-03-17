import * as path from 'path'
import * as url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const pathToEnv = path.resolve(__dirname, '../env/.env')
const pathToConfigDir = path.resolve(__dirname, '../config/')

const configPaths = {
  pathToEnv,
  pathToConfigDir
}

export default configPaths