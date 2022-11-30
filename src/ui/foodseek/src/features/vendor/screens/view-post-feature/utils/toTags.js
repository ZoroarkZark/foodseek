export const toTags = ( str ) => {
  let result = str.split( '#' )
  return result.map((e) => {if (e) {return e.trim()}}).filter(function(item){return item !== undefined})
}

