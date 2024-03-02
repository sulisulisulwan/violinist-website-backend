import * as express from 'express'

import { emailHandler } from '../../middleware/emailHandler.js'
import Request from '../../Request.js'
import Response from '../../Response.js'
import generateRequest from '../generateRequest.js'

const Contact = express.Router()

Contact.post(
  '/', 
  generateRequest,
  async (req, res) => {
    const request = (req as any).requestObj

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
      requestObj = await emailHandler.handleEmail(requestObj)

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
)

export default Contact
