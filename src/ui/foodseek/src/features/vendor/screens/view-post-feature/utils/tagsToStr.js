export const tagsToStr = (arr) => {
    if (arr && arr.length >= 1){
        let str = arr.join( ' #' )
        return '#'+str
    }
    return '#'
}
