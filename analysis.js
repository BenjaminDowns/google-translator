// require built-in modules
const fs = require('fs')

// what's a terminal message without lovely colors?
const colors = require('colors')

// load config settings
const config = require('./config.json')
const destinationDir = config.analysis.destination
const source = config.analysis.source

// load list of stopwords to filter out of text
const stopWords = fs.readFileSync('stopwords.txt', 'utf8').split('\n')

// initialize global variables
var sum, 
    dictionary = {}

// get text
var text = fs.readFileSync(source, 'utf8')
var splitText = text.split(' ')
console.log(`Running`.underline.red)
console.log(`Source text length: ${splitText.length}`.underline.green)

function reduceAndWrite(callback) {
    sum = splitText.reduce((a, b) => {
        b = b.toLowerCase().replace(/[^\w]/g, '')
        a[b] ? a[b] += 1 : a[b] = 1
        return a
    }, dictionary)
    
    // wait 5 seconds to make sure the function finishes before calling the callback
    setTimeout(callback, 5 * 1000)
    
}

function writeFile() {
    
    // write raw version of dictionary to file
    fs.writeFile(`${destinationDir}rawDictionary.txt`, JSON.stringify(sum, null, 2), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Done writing raw dictionary'.underline.green)
        }
    })
    
    // make analyzed version of dictionary
    var array = []
    for (a in sum) {
        if (sum[a] > 2 && stopWords.indexOf(a.toLowerCase()) < 0) {
            array.push([a, sum[a]])
        }
    }
    array.sort(function (a, b) { return a[1] - b[1] });
    array = array.reverse().map(x => x = `${x[0]} : ${x[1].toString()}`)
    
    // write analyzed version of dictionary to file
    fs.writeFile(`${destinationDir}filteredDictionary.txt`, JSON.stringify(array, null, 2), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Done writing filtered dictionary!'.underline.rainbow)
        }
    })
} // end of writeFile function

reduceAndWrite(writeFile)