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

function makeRawDictionary() {
    rawDictionary = splitText.reduce((dict, word) => {
        word = word.toLowerCase().replace(/[^\w]/g, '')
        dict[word] ? dict[word] += 1 : dict[word] = 1
        return dict
    }, emptyDict)
    return rawDictionary
}

function makeFilteredDictionary(rawDictionary) {
    let filteredDictionary = []
    for (let word in rawDictionary) {
        if (rawDictionary[word] > 2 && stopWords.indexOf(word.toLowerCase()) < 0) {
            filteredDictionary.push([word, rawDictionary[word]])
        }
    }
    // sort by number of occurrences of each word
    filteredDictionary.sort(function (a, b) { return b[1] - a[1] });
    // format to read as "[word]: [number of occurrences of word]"
    filteredDictionary = filteredDictionary.map(x => x = `${x[0]} : ${x[1].toString()}`)
    return filteredDictionary
}


function writeFile() {

    // write raw version of dictionary to file
    fs.writeFile(`${destinationDir}rawDictionary.txt`, JSON.stringify(makeRawDictionary(), null, 2), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Done writing raw dictionary'.inverse.green)
        }
    })

    // write analyzed version of dictionary to file
    fs.writeFile(`${destinationDir}filteredDictionary.txt`, JSON.stringify(makeFilteredDictionary(rawDictionary), null, 2), 'utf-8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Done writing filtered dictionary!'.inverse.green)
        }
    })
} // end of writeFile function

writeFile()