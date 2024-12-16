import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";
import Request from "../../request/Request.js";


export default class PostCalendar extends BaseRoute {

  protected model: MasterModel
  
  constructor(model: MasterModel) {
    super()
    this.model = model
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    request.setData(req.body)
    try {
      const insertId = (await this.model.calendar.createEventGrouping(request)).getData()[0].insertId
      for (let i = 0; i < req.body.eventDates.length; i++) {
        const eventDate = req.body.eventDates[i]
        eventDate.eventGroupingId = insertId
        request.setData(eventDate);
        (await this.model.calendar.createEvent(request)).getData()
      }
      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}