'use strict'
// require built-in module
const fs = require('fs')

// what's a terminal message without colors?
const colors = require('colors')

// load config settings or get from command line args
const config = require('../config.json')
const source = config.analysis.source.length > 0 ? config.analysis.source : process.argv(2)
const destinationDir = config.analysis.destination.length > 0 ? config.analysis.destination : process.argv(3)

// load list of stopwords to filter out of text
const stopWords = fs.readFileSync('stopwords.txt', 'utf8').split('\n')

// initialize global variables
let rawDictionary, 
    emptyDict = {}

// get text
const text = fs.readFileSync(source, 'utf8')
let splitText = text.split(' ')

console.log(`Running`.underline.red)
console.log(`Analyzing ${splitText.length} words`.underline.green)

function reduceAndWrite(callback) {
    rawDictionary = splitText.reduce((dict, word) => {
        word = word.toLowerCase().replace(/[^\w]/g, '')
        dict[word] ? dict[word] += 1 : dict[word] = 1
        return dict
    }, emptyDict)
    
    // use setTimeout to push the callback on the queue; thanks to async, this will wait for the stack to clear (i.e. the .reduce() to finish) before executing the callback
    setTimeout(callback, 0)
    
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
    
    // make analyzed version of dictionary: filtered out common words and alpha ordering
    var filteredDictionary = []
    for (let word in rawDictionary) {
        if (rawDictionary[word] > 2 && stopWords.indexOf(word.toLowerCase()) < 0) {
            filteredDictionary.push([word, rawDictionary[word]])
        }
    }
    // alphabetize
    filteredDictionary.sort(function (a, b) { return b[1] - a[1] });
    // format to read as "[word]: [number of occurrences of word]"
    filteredDictionary = filteredDictionary.map(x => x = `${x[0]} : ${x[1].toString()}`)
    
    // write analyzed version of dictionary to file
    fs.writeFile(`${destinationDir}filteredDictionary.txt`, JSON.stringify(filteredDictionary, null, 2), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Done writing filtered dictionary!'.inverse.green)
        }
    })
} // end of writeFile function

reduceAndWrite(writeFile)