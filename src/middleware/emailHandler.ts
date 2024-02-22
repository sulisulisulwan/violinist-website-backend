
import * as nodeMailer from 'nodemailer'
import generateReceiptMessage from './generateReceiptMessage'
import generateEmailToSuli from './generateEmailToSuli'
import config from './emailConfig'

type errors = {
  "-3008": "Address not found"
}


class EmailHandler {

  protected transporter: any
  protected errors: errors

  constructor() {
    this.transporter = this.initTransporter()
    this.errors = {
      "-3008": "Address not found"
    }
  }

  async handleEmail(requestObj: any) {

    const data = requestObj.getData()
  
    try {
  
      await this.sendMessage({
        from: config.fromAddress,
        to: config.toAddress,
        subject: `Incoming Message from ${data.firstName} ${data.lastName} at sulimantekalliviolin.com`,
        text: generateEmailToSuli(data)
      })
      
    } catch(e) {
      return this.handleError(e, requestObj)
    }
  
    try {
      await this.sendMessage({
          from: config.fromAddress,
          to: data.email,
          subject: 'Confirmation of message receipt',
          text: generateReceiptMessage(data)
        })
    } catch(e) {
      return this.handleError(e, requestObj)
    }
    return requestObj
  
  }
  
  handleError(e: any, requestObj: any) {
    const errorMessage = this.errors[e.errno.toString() as keyof errors] || e.sendMessage
    requestObj.setError(errorMessage)
    return requestObj
  }

  initTransporter() {
    return nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "email.sulimantekalliviolin@gmail.com",
        pass: "cnpqgedhyactzawc", //TODO: obviously this should be secured
      },
    });
  }

  async sendMessage(options: any) {
    return await this.transporter.sendMail(options)
  }
  
}

const emailHandler = new EmailHandler()
export {
  emailHandler
}