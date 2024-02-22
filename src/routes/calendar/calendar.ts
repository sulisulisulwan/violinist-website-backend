import * as express from 'express'

import CalendarModel from '../../models/calendar'
import Request from '../../Request'

import { getWasYesterdayOrBefore, sortBackwardTime, sortForwardTime } from '../utils'
import MySQL from '../../db/db'
import config from '../../db/config'
import { CalendarDataAPI, EventGroupAPI, EventGroupMYSQL, EventListingAPI, EventListingMYSQL } from 'suli-violin-website-types/src'

const Calendar = express.Router()
const calendarModel = new CalendarModel(new MySQL(config))

Calendar.get('/', async(req, res) => {
  console.log('[GET] /calendar/')
  let request = new Request()
  request.setData(req.body)

  try{
    const eventGroupingResults: EventGroupMYSQL[] = (await calendarModel.getAllGroupings(request)).getData()
    const eventResults: EventListingMYSQL[] = (await calendarModel.getAllEvents(request)).getData()
    

    const eventsSortedByGroupId = eventResults.reduce((memo: Record<string, EventListingAPI[]>, curr: EventListingMYSQL) => {
      const eventGroupingId = curr.eventGroupingId.toString()

      if (!memo[eventGroupingId as keyof EventListingAPI]) memo[eventGroupingId] = []
  
      const transformedLocation = JSON.parse(curr.location)
      const transformedCurr = {
        id: curr.id,
        dateTime: curr.dateTime,
        location: {
          country: transformedLocation.country,
          stateOrProvince: transformedLocation.stateOrProvince,
          city: transformedLocation.city,
          venue: transformedLocation.venue
        },
        link: curr.link,
        eventGroupingId: curr.eventGroupingId
      }
      memo[curr.eventGroupingId].push(transformedCurr)
      return memo
    }, {} as Record<string, EventListingAPI[]>) 
  
    const allMappedResponseItems: EventGroupAPI[] = eventGroupingResults.map((result: EventGroupMYSQL) => {

      return {
        id: result.id,
        dateRange: {
          start: result.dateStart,
          end: result.dateEnd
        },
        type: result.type,
        venue: result.venue,
        presenter: result.presenter,
        artists: JSON.parse(result.artists),
        program: JSON.parse(result.program),
        eventDates: eventsSortedByGroupId[result.id] || []
      }
    })
    
    const { past, upcoming } = allMappedResponseItems.reduce((memo: CalendarDataAPI, curr: EventGroupAPI) => {
      
      const wasYesterdayOrBefore = getWasYesterdayOrBefore(curr.dateRange.start)

      wasYesterdayOrBefore ? memo.past.push(curr) : memo.upcoming.push(curr)
      return memo
    }, {
      past: [],
      upcoming: []
    })
  
    upcoming.sort(sortForwardTime)
    past.sort(sortBackwardTime)

    const all = allMappedResponseItems.sort(sortForwardTime)
    const resData = {
      results: {
        past,
        upcoming,
        all
      }
    }

    res.status(200).json(resData)

  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }

})

Calendar.post('/', async(req, res) => {
  console.log('[POST] /calendar/')
  let request = new Request()
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

  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
  
})

Calendar.patch('/', async(req, res) => {
  console.log('[PATCH] /calendar/')

  let request = new Request()
  request.setData(req.body)

  try {
    (await calendarModel.updateEventGrouping(request)).getData()
    
    for (let i = 0; i < req.body.eventDates.length; i++) {
      const eventDate = req.body.eventDates[i]
      request.setData(eventDate)

      if (!eventDate.hasOwnProperty('id')) {
        eventDate.eventGroupingId = req.body.id
      }

      eventDate.hasOwnProperty('id') ? (await calendarModel.updateEvent(request)).getData() : (await calendarModel.createEvent(request)).getData()
    }
    
    res.sendStatus(201)

  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})

Calendar.delete('/', async(req, res) => {
  console.log('[DELETE] /calendar/')

  let request = new Request()
  request.setData(req.query)

  try {
    (await calendarModel.deleteById(request)).getData()

    res.sendStatus(204)
  } catch(request) {
    request instanceof Request ? console.error(request.getError()) : console.error(request)
    res.sendStatus(400)
  }
})


export default Calendar