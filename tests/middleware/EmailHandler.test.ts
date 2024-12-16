
import { mock, test } from 'node:test'
import assert from 'node:assert/strict'
import suite from 'node:test'
import config from "../config";
import { EmailHandler } from '../../src/middleware/EmailHandler'
import Request from '../../src/request/Request';
import Mailer from 'nodemailer/lib/mailer/index.js'

type NodeMailer = {
  createTransport: (transporter: any, defaults?: any) => Mailer,
  createTestAccount: (apiUrl: string, callback: Function) => Promise<any>,
  getTestMessageUrl: (info: any) => string | boolean
}

const mockNodeMailer: NodeMailer = {
  createTransport: (transporter: any, defaults?: any) => {
    return {
      sendMail: async (options: any) => undefined
    } as unknown as Mailer
  },
  createTestAccount: async (apiUrl: string, callback: Function) => {
    return 
  }, 
  getTestMessageUrl: (info: any) => {
    return false
  }
}

const mockCreateTransport = mock.fn(mockNodeMailer.createTransport)

const emailHandler = new EmailHandler(config, mockNodeMailer)

let request = new Request()
request.setData({
  firstName: 'John',
  lastName: 'Smith',
  email: 'fakeemail@fakeemails.co',
  message: 'Lorem Ipsum yadda yadda'
})

request = await emailHandler.handleEmail(request)

console.log(mockCreateTransport)