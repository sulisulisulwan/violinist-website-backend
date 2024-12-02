import * as path from 'path'
import * as url from 'url'
import Config from '@sulimantekalli/configlib'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const pathToEnv = path.resolve(__dirname, '../env/.env')
const pathToConfigDir = path.resolve(__dirname, '../config/')

const configPaths = {
  pathToEnv,
  pathToConfigDir
}

const config = new Config(configPaths, [
  "MYSQL_CONFIG_USER",
  "MYSQL_CONFIG_PASSWORD",
  "MYSQL_CONFIG_DATABASE",
  "MYSQL_CONFIG_TIMEZONE",
  "UPLOAD_DIRECTORY",
  "STORAGE_AUDIO_FILES",
  "STORAGE_PHOTO_FILES",
  "LOGGER_FILE_PATH",
  "LOGGER_LOG_TO_CONSOLE",
  "LOGGER_LOG_TO_TEXT_FILE"
])

export default config