import * as express from 'express'
import CalendarModel from '../../models/calendar.js'
import MySQL from '../../db/db.js'
import Config from '../../config/Config.js'
import { EventGroupMYSQL, EventListingMYSQL } from 'suli-violin-website-types/src'
import generateRequest from '../generateRequest.js'
import TransformCalendar from '../../transformers/TransformCalendar.js'

const config = new Config()
const Calendar = express.Router()
const calendarModel = new CalendarModel(new MySQL(config.getField('MYSQL_CONFIG')))
const transformCalendar = new TransformCalendar()

Calendar.get(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    request.setData(req.body)
    try{
      const eventGroupingResults: EventGroupMYSQL[] = (await calendarModel.getAllGroupings(request)).getData()
      const eventResults: EventListingMYSQL[] = (await calendarModel.getAllEvents(request)).getData()
      const resData = transformCalendar.transformGet(eventGroupingResults, eventResults)
      res.status(200).json(resData)
    } catch(e) {
      (req as any).logger.log(e)
      res.sendStatus(400)
    }

  }
)

Calendar.post(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    request.setData(req.body)
    try {
      const insertId = (await calendarModel.createEventGrouping(request)).getData()[0].insertId
      for (let i = 0; i < req.body.eventDates.length; i++) {
        const eventDate = req.body.eventDates[i]
        eventDate.eventGroupingId = insertId
        request.setData(eventDate);
        (await calendarModel.createEvent(request)).getData()
      }
      res.status(201).json({ insertId })
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
    
  }
)

Calendar.patch(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    request.setData(req.body)
    try {
      (await calendarModel.updateEventGrouping(request)).getData()
      
      for (let i = 0; i < req.body.eventDates.length; i++) {
        const eventDate = req.body.eventDates[i]
        request.setData(eventDate)
        if (eventDate.id === null) eventDate.eventGroupingId = req.body.id
        eventDate.id !== null ? (await calendarModel.updateEvent(request)).getData() : (await calendarModel.createEvent(request)).getData()
      }
      
      res.sendStatus(201)

    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)

Calendar.delete(
  '/', 
  generateRequest,
  async(req, res) => {
    const request = (req as any).requestObj
    request.setData(req.query)

    try {
      (await calendarModel.deleteById(request)).getData()
      res.sendStatus(204)
    } catch(e) {
      (req as any).logger.log(e.stack)
      res.sendStatus(400)
    }
  }
)


export default Calendar