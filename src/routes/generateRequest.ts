import Logger from "../Logger.js"
import Request from "../Request.js"
import Config from '@sulimantekalli/configlib'
import configPaths from "../configPaths.js"

const generateRequest = (req: any, res: any, next: any) => {
  req.logger = new Logger(new Config(configPaths))
  req.requestObj = new Request()
  req.logger.log(`[${req.method}] ${req.baseUrl}`)
  next()
}

export default generateRequest