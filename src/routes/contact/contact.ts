import * as express from 'express'

import { emailHandler } from '../../middleware/emailHandler.js'
import Request from '../../Request.js'
import Response from '../../Response.js'

const Contact = express.Router()

Contact.post('/', async (req, res) => {

  console.log('[GET] /contact/')
  
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
    console.log(e)
    res.sendStatus(500)
  }

})

export default Contact
