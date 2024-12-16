import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";
import Response from "../../response/Response.js";
import { EmailHandler } from "../../middleware/EmailHandler.js";

export default class PostContact extends BaseRoute {

  protected model: MasterModel
  protected emailHandler: EmailHandler
  
  constructor(model: MasterModel, emailHandler: EmailHandler) {
    super()
    this.model = model
    this.emailHandler = emailHandler
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {

    const {
      firstName,
      lastName,
      email,
      message
    } = req.body.data

    const data = {
      firstName,
      lastName,
      email,
      message
    }

    let requestObj = new Request()
    requestObj.setData(data)
    
    try {
      requestObj = await this.emailHandler.handleEmail(requestObj)

      const responseObj = new Response()
      if (requestObj.getError().isError) {
        responseObj.setError(requestObj.getError().message)
      }
      
      res.status(201).json(responseObj.getObj())
      
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(500)
    }
  }
}