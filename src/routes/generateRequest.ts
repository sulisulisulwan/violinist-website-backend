import Logger from "../logger/Logger.js"
import Request from "../request/Request.js"
import config from "../configPaths.js"

const generateRequest = (req: any, res: any, next: any) => {
  req.logger = new Logger(config)
  req.requestObj = new Request()
  req.logger.log(`[${req.method}] ${req.baseUrl}`)
  next()
}

export default generateRequest