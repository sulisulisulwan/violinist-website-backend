import { CalendarDataAPI, EventGroupAPI, EventGroupMYSQL, EventListingAPI, EventListingMYSQL } from "suli-violin-website-types/src"
import { getWasYesterdayOrBefore, sortBackwardTime, sortForwardTime } from "../routes/utils.js"

class TransformCalendar {

  public transformGet(eventGroupingResults: any, eventResults: any) {
  
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
    return resData
  }
  

}

export default TransformCalendar