import fs from 'fs/promises'
import Config from './config/Config'

class Logger {

  protected config

  constructor(config: Config) {
    this.config = config
  }

  public async log(message: string) {
    const log = await this.createLogString(message)
    if (this.config.getField('LOGGER_LOG_TO_TEXT_FILE')) await this.logToTextFile(log)
    if (this.config.getField('LOGGER_LOG_TO_CONSOLE')) this.logToConsole(log)
  }

  public async logToConsole(log: string) {
    console.log(log)
  }

  public async logToTextFile(log: string) {
    const date = new Date().toISOString().split('T')[0]
    const dirExists = await this.logDateDirExists(date)
    const logDir = this.config.getField('LOGGER_FILE_PATH') + date + '/';
    if (!dirExists) {
      await fs.mkdir(logDir)
    }
    if (!(await this.logFileExists(logDir))) await this.initLogFile(logDir)
    await this.writeLog(log, logDir)
  }

  protected async logDateDirExists(dir: string) {
    try {
      const fileHandle = await fs.open(this.config.getField('LOGGER_FILE_PATH') + dir)
      fileHandle.close()
      return true
    } catch(e) {
      return false
    }
  }

  protected async writeLog(log: string, logDir: string) {
    await fs.appendFile(logDir + 'error_log.txt', log)
  }
  
  protected createLogString(message: string) {
    return this.getLogDateTime() + message + '\n';
  }

  protected getLogDateTime() {
    return `[${new Date(Date.now())}]: `
  }

  protected async initLogFile(logDir: string) {
    await this.writeLog(this.createLogString('Initializing log'), logDir)
  }

  protected async logFileExists(logDir: string) {
    const dir = await fs.readdir(logDir)
    return dir.includes('error_log.txt')
  }

}

export default Logger