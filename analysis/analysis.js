// require built-in module
const fs = require('fs')

// what's a terminal message without colors?
const colors = require('colors')

// load config settings or get from command line args
const config = require('./config.json')
const source = config.analysis.source.length > 0 ? config.analysis.source : process.argv(2)
const destinationDir = config.analysis.destination.length > 0 ? config.analysis.destination : process.argv(3)

// load list of stopwords to filter out of text
const stopWords = fs.readFileSync('stopwords.txt', 'utf8').split('\n')

// initialize global variables
var rawDictionary, 
    emptyDict = {}

// get text
var text = fs.readFileSync(source, 'utf8')
var splitText = text.split(' ')

console.log(`Running`.underline.red)
console.log(`Source text length: ${splitText.length}`.underline.green)

function reduceAndWrite(callback) {
    rawDictionary = splitText.reduce((a, b) => {
        b = b.toLowerCase().replace(/[^\w]/g, '')
        a[b] ? a[b] += 1 : a[b] = 1
        return a
    }, emptyDict)
    
    // wait 5 seconds to make sure the function finishes before calling the callback; there must be a better way to do this, but this works for now.
    setTimeout(callback, 5 * 1000)
    
}

function writeFile() {
    
    // write raw version of dictionary to file
    fs.writeFile(`${destinationDir}rawDictionary.txt`, JSON.stringify(rawDictionary, null, 2), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Done writing raw dictionary'.inverse.green)
        }
    })
    
    // make analyzed version of dictionary (filtered out common words)
    var array = []
    for (a in rawDictionary) {
        if (rawDictionary[a] > 2 && stopWords.indexOf(a.toLowerCase()) < 0) {
            array.push([a, rawDictionary[a]])
        }
    }
    array.sort(function (a, b) { return a[1] - b[1] });
    array = array.reverse().map(x => x = `${x[0]} : ${x[1].toString()}`)
    
    // write analyzed version of dictionary to file
    fs.writeFile(`${destinationDir}filteredDictionary.txt`, JSON.stringify(array, null, 2), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Done writing filtered dictionary!'.inverse.green)
        }
    })
} // end of writeFile function

reduceAndWrite(writeFile)