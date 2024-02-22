import MySQL from "../db/db";
import { prepareStringForMySQL } from "./utils";
import RequestRequired from "../request-required-wrapper/RequestRequired";
import Request from "../Request";
import { EventGroupAPI } from 'suli-violin-website-types/src'

class CalendarModel extends RequestRequired {

  protected db: MySQL

  constructor(dbInstance: MySQL) {
    super()
    this.db = dbInstance
  }

  async getAllGroupings(request: Request): Promise<Request> {
    const q = 'SELECT * from eventGroupings ORDER BY dateStart;'
    const results = await this.db.query(q)
    request.setData(results[0])
    return request
  }

  async getAllEvents(request: Request): Promise<Request> {
    const q = 'SELECT * from events ORDER BY dateTime;'
    const results = await this.db.query(q)
    request.setData(results[0])
    return request
  }

  async getById(request: Request): Promise<Request> {

    const data = request.getData()
    const id = data.id

    const q = `SELECT * FROM eventGroupings WHERE id=${id};`
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }
  
  async updateEventGrouping(request: Request): Promise<Request> {

    const data: EventGroupAPI = request.getData()

    const q = `
      UPDATE eventGroupings 
      SET 
        dateStart = '${data.dateRange.start}',
        dateEnd = '${data.dateRange.end}',
        venue = '${prepareStringForMySQL(data.venue)}',
        type = '${prepareStringForMySQL(data.type)}',
        presenter = '${prepareStringForMySQL(data.presenter)}',
        artists = '${prepareStringForMySQL(JSON.stringify(data.artists))}',
        program = '${prepareStringForMySQL(JSON.stringify(data.program))}'
      WHERE id = ${data.id};
    `
    const results = await this.db.query(q)
    request.setData(results)
    return request
    
  }
  
  async updateEvent(request: Request): Promise<Request> {

    const data = request.getData()

    const q = `
      UPDATE events 
      SET 
        dateTime = '${data.dateTime}',
        location = '${prepareStringForMySQL(JSON.stringify(data.location))}',
        link = '${prepareStringForMySQL(data.link)}'
      WHERE id = ${data.id};
    `
    const results = await this.db.query(q)
    request.setData(results)
    return request
  }

  async createEventGrouping(request: Request): Promise<Request> {

    const data: EventGroupAPI = request.getData()

    const q = `
      INSERT INTO eventGroupings (
        dateStart,
        dateEnd,
        venue,
        type,
        presenter,
        artists,
        program     
      ) 
      VALUES (
        '${data.dateRange.start}',
        '${data.dateRange.end}',
        '${prepareStringForMySQL(data.venue)}',
        '${prepareStringForMySQL(data.type)}',
        '${prepareStringForMySQL(data.presenter)}',
        '${prepareStringForMySQL(JSON.stringify(data.artists))}',
        '${prepareStringForMySQL(JSON.stringify(data.program))}'
      );
    `
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async createEvent(request: Request): Promise<Request> {

    const data = request.getData()

    const q = `
      INSERT INTO events (
        dateTime,
        location,
        link,
        eventGroupingId
      )
      VALUES (
        '${data.dateTime}',
        '${prepareStringForMySQL(JSON.stringify(data.location))}',
        '${prepareStringForMySQL(data.link)}',
        ${data.eventGroupingId}
      )
    `
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }

  async deleteById(request: Request): Promise<Request> {
    const data = request.getData()
    const id = data.id
    const q = `DELETE FROM eventGroupings WHERE id = ${id}`
    const result = await this.db.query(q)
    request.setData(result)
    return request
  }
}

export default CalendarModel