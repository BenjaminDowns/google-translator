'use strict'
console.log('working!')
var running = true

//  config variables
const config = require('./config.json')
const textToBeTranslated = config.source.length > 0 ? config.source : process.argv(2)
const partialsFileName = config.partialsDestination.length > 0 ? config.partialsDestination : process.argv(3)
const completedFileName = config.completedDestination.length > 0 ? config.completedFileName : process.argv(4)

//  built-in node module
const fs = require('fs')

//  third-party npm modules 
const textract = require('textract')
const googleTranslate = require('google-translate')(config.apiKey)
const concat = require('concat-files')
const colors = require('colors/safe')

//  global variables 
// if you get Google to raise your quota, you can change these; otherwise the API will probably return a 403
var limit = 0,
    part = 0,
    start = -10000,
    extractedText,
    translateInterval,
    writtenFiles = []

// extract the file
textract.fromFileWithPath(textToBeTranslated, handleText)

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

    // increment to the next section of text and part of the translation
    part++
    start += 10000
    var end = start + 10000
    var nextFileName = `${partialsFileName}_part${part}`

    // make sure that the end of the file hasn't been reached
    if (start >= limit) {
        // if the end of the file has been reached, concat to a final file and stop the translation.

        clearInterval(translateInterval);
        running = false;
        concat(writtenFiles, completedFileName, () => {
            console.log(colors.green(`FINISHED! \n Your completed file is at ${completedFileName}`))
            process.exit()
        })
    }

    var nextTextToBeTranslated = extractedText.slice(start, end)

    // SEND IT OFF TO GOOGLE FOR TRANSLATING    
    if (running) {
        googleTranslate.translate(nextTextToBeTranslated, 'en', function (err, translation) {
            if (err) {
                console.log(err)
                clearInterval(translateInterval)
            } else {

                // WRITE IT TO FILE
                console.log(`Detected source language: ${translation.detectedSourceLanguage}`)
                console.log(`Translating from character ${start} to ${end} \n Text remaining: ${limit - start}`)
                writeFile(nextFileName, translation.translatedText);

            }
        }) // end of googleTranslate
    }
}


function writeFile(name, data) {
    // writes the file to the system

    fs.writeFile(name, data, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(colors.blue(`Partial successfully written: ${name}`))
            writtenFiles.push(name)
        }
    })
}