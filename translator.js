'use strict'
var running = true

//  config variables
const config = require('./config.json')
const textToBeTranslated = config.source.length > 0 ? config.source : process.argv(2)
const partialsFileName = config.partialsDestination.length > 0 ? config.partialsDestination : process.argv(3)
const completedFileName = config.completedDestination.length > 0 ? config.completedDestination : process.argv(4)

//  built-in node module
const fs = require('fs')

//  third-party npm modules 
const textract = require('textract')
const googleTranslate = require('google-translate')(config.apiKey)
const concat = require('concat-files')
const colors = require('colors')


console.log('Running!'.red.underline)

//  global variables 
// if you get Google to raise your quota, you can change these; otherwise the API will probably return a 403
var limit = 0,
    part = 0,
    start = -10000,
    extractedText,
    translateInterval,
    writtenFiles = []

function concatFilesAndEnd() {
    // combines all partials to a single file, and ends the translation process
    
    clearInterval(translateInterval);
    running = false;
    concat(writtenFiles, completedFileName, () => {
        console.log(colors.green(`FINISHED! \n Your completed file is at ${completedFileName}`))
        process.exit()
    })
}

function writeFile(name, data) {
    // writes the partial to the system and saves the name of the partial for combining later 

    fs.writeFile(name, data, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(colors.blue(`Partial successfully written: ${name}`))
            writtenFiles.push(name)
        }
    })
}

function handleText(error, text) {
    // kicks off the translation (every 101 seconds) if the textract was successful

    if (error) {
        console.log(error)
        process.exit(2)

    } else {
        extractedText = text
        limit = extractedText.length

        // call translate right away, then once every 101 seconds
        translate()
        translateInterval = setInterval(translate, 1000 * 101)
    }
}

function translate() {
    // passes the text to the google translate API, 10k characters at a time

    // increment to the next section of text and the next part of the translation
    part++
    start += 10000
    var end = start + 10000
    var nextFileName = `${partialsFileName}_part${part}`

    if (start >= limit) {
        console.log(`Finished translation; now combining partials`.green.underline)
        concatFilesAndEnd()
        
    } else {

        var nextExcerpt = extractedText.slice(start, end)

        // SEND IT OFF TO GOOGLE FOR TRANSLATING    
        googleTranslate.translate(nextExcerpt, 'en', (err, translation) => {         
            if (err) {
                console.log(err)
                process.exit(2)

            } else {
                // if successfully translated, write the partial to file
                console.log(`Detected source language: ${translation.detectedSourceLanguage}`)
                console.log(`Translating from character ${start} to ${end} \nText remaining: ${limit - start}`)
                writeFile(nextFileName, translation.translatedText);

            }
        }) // end of googleTranslate

    }
}

// pulls the trigger
textract.fromFileWithPath(textToBeTranslated, handleText)