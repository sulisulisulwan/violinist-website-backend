import BaseRoute from "../BaseRoute.js";
import { MasterModel } from "../../models/index.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express-serve-static-core";

import Request from "../../request/Request.js";
import TransformCalendar from "../../transformers/TransformCalendar.js";
import { EventGroupMYSQL, EventListingMYSQL } from "suli-violin-website-types/src/index.js";


export default class GetCalendar extends BaseRoute {

  protected model: MasterModel
  protected transformer: TransformCalendar
  
  constructor(model: MasterModel, transformer: TransformCalendar) {
    super()
    this.model = model
    this.transformer = transformer
    this.exec = this.exec.bind(this)
  }

  async exec(req: ExpressRequest, res: ExpressResponse) {
    const request = (req as any).requestObj as Request
    request.setData(req.body)
    try{
      const eventGroupingResults: EventGroupMYSQL[] = (await this.model.calendar.getAllGroupings(request)).getData()
      const eventResults: EventListingMYSQL[] = (await this.model.calendar.getAllEvents(request)).getData()
      const resData = this.transformer.transformGet(eventGroupingResults, eventResults)
      res.status(200).json(resData)
    } catch(e) {
      (req as any).logger.log(e)
      res.sendStatus(400)
    }
  }
}