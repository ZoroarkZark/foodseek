import { resolveUri } from 'expo-asset/build/AssetSources'
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar'
import React from 'react'


// assumes that the date is in local time
export const Time = ( date ) => {
  return (date.getUTCHours() * 100) + date.getUTCMinutes()
}

// assumes that the date is in local time
export const Day = ( date ) => {
  return date.getUTCDay()
}

// assumes that the date is in local time
export class time {
  constructor( { day, time, date = new Date() } = {} ) {
    let temp = date
    this.day = day ? day : Day( temp )
    this.time = time ? time : Time( temp )
  }
  isEqual ( obj ) {
    if ( !obj ) return false
    const { day, time } = obj
    return ( day == this.day && time == this.time )
  }
  isLEQ ( obj ) {
    if ( !obj ) return false
    const { day, time } = obj
    return ( day == this.day && this.time <= time )
  }
  isGEQ ( obj ) {
    if ( !obj ) return false
    const { day, time } = obj
    return ( day == this.day && this.time >= time )
  }
}

export class period {
  constructor( { open, close, timeOpen, timeClose } = {} ) {
    this.open = open ? open : new time({ open, close, timeOpen, timeClose } = {} )
    this.close = close ? close : new time({ open, close, timeOpen, timeClose } = {} )
  }
  isEqual ( obj ) {
    if ( !obj ) return false
    const { open, close } = obj
    return ( open.isEqual( this.open ) && close.isEqual( this.close ) )
  }
  includes ( obj ) {
    // handle the input for time comparison
    if ( !( obj instanceof time ) ) {
      if ( isNaN( obj ) ) return false
      obj = new time( this.day, obj )
    }
    if ( obj.isGEQ( this.open ) && obj.isLEQ( this.close ) ) return true
    return false
  }
}


// assumes that added periods do not collide with the current periods
export class periods {
  constructor ( { value, period } = {} ) {
    this.value = value ? value : period ? [period] : []
  }
  
  add ( obj ) {
    if ( obj instanceof period ) {
      this.value = [ ...this.value, obj ]
    }
  }

  remove ( obj ) {
    if ( obj instanceof period ) {
      this.value = this.value.filter(periodObj => !periodObj.isEqual(obj))
    }
  }

  contains ( obj ) {
    const [ result, setResult ] = useState( false )
    if ( obj instanceof period ) {
      return this.value.array.includes(obj)
    } else {
        this.value.forEach( element => {
          if ( element.includes( obj ) ) setResult( true )
      })
    }
    return result
  }

  day ( num ) {
    let result = this.value.map( ( item ) => {
      if ( item.open.day == num )  return item
    } )
    return result
  }
  
}



export class opening_hours extends periods {
  open_now = false
  weekday_text = [
    "Monday: ",
    "Tuesday: ",
    "Wednesday: ",
    "Thursday: ",
    "Friday: ",
    "Saturday: ",
    "Sunday: "
  ]
  constructor(props) {
    super(props)
  }
  get open_now () {
    let now = new time()
    return this.periods.contains(now)
  }
  get weekday_text () {
    let weekday = this.weekday_text
    for ( let i = 0; i < 7; i++ ){
      
    }
  }

}
export class period {
  constructor
}

export class time_periods {
  constructor( {value = [], } ) {
    this.value = value
  }
}


  close = { day: 0, time: "1400" }, "open": { "day": 0, "time": "1130" } }