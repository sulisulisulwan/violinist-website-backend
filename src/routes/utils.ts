import { EventGroupAPI } from 'suli-violin-website-types/src'

export const createMySqlDatetimeOfNow  = () => {
  const [date, time] = new Date().toISOString().split('T')
  const timeTrimmed = time.substring(0,8)
  const dateTime = date + ' ' + timeTrimmed
  return dateTime
}

export const getDoubleQuotesEscapedString = (str: string) => {

  let escaped = ''
  for (let i = 0; i < str.length; i++) {

    let char = str[i]

    if (char === '"') {
      escaped += '\\"'
      continue
    }

    if (char === "'") {
      escaped += "\'"
      continue
    }
    escaped += char
  }
  return escaped
}

    
export const getWasYesterdayOrBefore = (date: string) => {
  const now = new Date(Date.now())
  const nowDay = now.getDate()
  const nowMonth = now.getMonth()
  const nowYear = now.getFullYear()

  const currDateItemTime = new Date(date)
  const currDay = currDateItemTime.getDate()
  const currMonth = currDateItemTime.getMonth()
  const currYear = currDateItemTime.getFullYear()

  
  if (currYear < nowYear) return true
  if (currYear > nowYear) return false

  if (currMonth < nowMonth) return true
  if (currMonth > nowMonth) return false
  
  if (currDay < nowDay) return true
  return false
}

export const sortForwardTime = (eventGroupDataA: EventGroupAPI, eventGroupDataB: EventGroupAPI) => {
  const startA = eventGroupDataA.dateRange.start
  const startB = eventGroupDataB.dateRange.start
  const timeA = new Date(startA).getTime()
  const timeB = new Date(startB).getTime()
  return timeA - timeB
}

export const sortBackwardTime = (eventGroupDataA: EventGroupAPI, eventGroupDataB: EventGroupAPI) => {
  const startA = eventGroupDataA.dateRange.start
  const startB = eventGroupDataB.dateRange.start
  const timeA = new Date(startA).getTime()
  const timeB = new Date(startB).getTime()
  return timeB - timeA
}