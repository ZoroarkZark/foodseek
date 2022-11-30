export const LogDateTime = ( expiration ) => {
  // console.log('actual value: ', expiration.getTime())
  let e = new Date( expiration )
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  console.log( e.toLocaleDateString( 'en-US', options ) );
  console.log(e.toLocaleTimeString('en-US'))
}

