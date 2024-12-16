
import Request from '../request/Request.js'
import Config from '@sulimantekalli/configlib'
import Mailer from 'nodemailer/lib/mailer/index.js'

type errors = {
  "-3008": "Address not found"
}

type NodeMailer = {
  createTransport: (transporter: any, defaults?: any) => Mailer,
  createTestAccount: (apiUrl: string, callback: Function) => Promise<any>,
  getTestMessageUrl: (info: any) => string | boolean
}

class EmailHandler {

  protected transporter: Mailer
  protected errors: errors
  protected config: Config

  constructor(config: Config, nodeMailer: NodeMailer) {
    this.transporter = this.initTransporter(nodeMailer)
    this.errors = {
      "-3008": "Address not found"
    }
    this.config = config
  }

  public async handleEmail(requestObj: Request): Promise<Request> {

    const data = requestObj.getData()

    try {
      
      await this.sendMessage({
        from: this.config.getField('EMAIL_FROM_ADDRESS'),
        to: this.config.getField('EMAIL_TO_ADDRESS'),
        subject: `Incoming Message from ${data.firstName} ${data.lastName} at sulimantekalliviolin.com`,
        text: this.generateEmailToSuli(data)
      })
      
    } catch(e) {
      return this.handleError(e, requestObj)
    }
  
    try {
      await this.sendMessage({
          from: this.config.getField('EMAIL_FROM_ADDRESS'),
          to: data.email,
          subject: 'Confirmation of message receipt',
          text: this.generateReceiptMessage(data)
        })
    } catch(e) {
      return this.handleError(e, requestObj)
    }
    return requestObj
  
  }

  protected initTransporter(nodemailer: NodeMailer): Mailer {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "email.sulimantekalliviolin@gmail.com",
        pass: "cnpqgedhyactzawc", //TODO: obviously this should be secured
      },
    });
  }


  protected async sendMessage(options: any): Promise<any> {
    return await this.transporter.sendMail(options)
  }

  protected generateEmailToSuli (data: any): string {
    return `First name: ${data.firstName}
    Last name: ${data.lastName}
    Email: ${data.email}
    Message: ${data.message}
    `
  }

  protected generateReceiptMessage(data: any): string {
    return `
    Hi ${data.firstName}!
    
    Thank you for visiting my site and leaving a message!  I will get back with you with as a response soon!
    
    -Suliman
  
    Your message:
  
    ${data.message}
    `
  }
  
  protected handleError(e: any, requestObj: Request) {
    const errorMessage = e.message
    requestObj.setError(errorMessage)
    return requestObj
  }

}

export {
  EmailHandler
}