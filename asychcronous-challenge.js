function asyncFunction(callback) {
    setTimeout(callback, 200)
}

let color = 'blue';

// asyncFunction(() => {
//     console.log('color is ', color)
// })

// fix: use closure

(color => {
   asyncFunction(() => {console.log('color is ', color)})
})(color)

color = 'green'


