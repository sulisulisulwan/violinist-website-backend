import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";

import Request from "../../request/Request.js";


export default class PatchCalendar extends BaseRoute {

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
      (await this.model.calendar.updateEventGrouping(request)).getData()
      
      for (let i = 0; i < req.body.eventDates.length; i++) {
        const eventDate = req.body.eventDates[i]
        request.setData(eventDate)
        if (eventDate.id === null) eventDate.eventGroupingId = req.body.id
        eventDate.id !== null ? (await this.model.calendar.updateEvent(request)).getData() : (await this.model.calendar.createEvent(request)).getData()
      }
      
      res.sendStatus(201)

    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
}