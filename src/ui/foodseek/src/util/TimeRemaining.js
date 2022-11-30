
// function computes the difference between two times, and returns an object containing it
export const TimeRemaining = ( { start = new Date(), end } = {} ) => {
  let result = {hours: 0, minutes: 0, seconds: 0, milliseconds: 0, message: ''}
  let milliseconds = ( end - start )
  let seconds = ( milliseconds / 1000 ).toFixed( 0 );
  let minutes = (milliseconds / (1000 * 60)).toFixed(0);
  let hours = ( milliseconds / ( 1000 * 60 * 60 ) ).toFixed( 0 );
  if ( seconds >= 60 ) {
    seconds = (seconds % 60).toFixed(0)
  }
  if ( minutes >= 60 ) {
    minutes = (minutes % 60).toFixed(0)
  }
  let message = `${ hours > 1 ? ' ' + hours + ' hrs' : hours == 1 ? ' ' + hours + ' hr' : '' }${ minutes > 1 ? ' ' + minutes + ' mins' : minutes == 1 ? ' ' + minutes + ' min' : '' }`
  result = {hours, minutes, seconds, milliseconds, message}
  return result
}