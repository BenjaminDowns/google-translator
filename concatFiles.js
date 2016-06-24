const concat = require('concat-files')

const writtenFiles = ["../2000/Translated/Reception_2000_to_2001_part1", "../2000/Translated/Reception_2000_to_2001_part2", "../2000/Translated/Reception_2000_to_2001_part3", "../2000/Translated/Reception_2000_to_2001_part4", "../2000/Translated/Reception_2000_to_2001_part5", "../2000/Translated/Reception_2000_to_2001_part6", "../2000/Translated/Reception_2000_to_2001_part7", "../2000/Translated/Reception_2000_to_2001_part8", "../2000/Translated/Reception_2000_to_2001_part9", "../2000/Translated/Reception_2000_to_2001_part10", "../2000/Translated/Reception_2000_to_2001_part11", "../2000/Translated/Reception_2000_to_2001_part12", "../2000/Translated/Reception_2000_to_2001_part13", "../2000/Translated/Reception_2000_to_2001_part14", "../2000/Translated/Reception_2000_to_2001_part15", "../2000/Translated/Reception_2000_to_2001_part16", "../2000/Translated/Reception_2000_to_2001_part17", "../2000/Translated/Reception_2000_to_2001_part18", "../2000/Translated/Reception_2000_to_2001_part19", "../2000/Translated/Reception_2000_to_2001_part20", "../2000/Translated/Reception_2000_to_2001_part21", "../2000/Translated/Reception_2000_to_2001_part22", "../2000/Translated/Reception_2000_to_2001_part23", "../2000/Translated/Reception_2000_to_2001_part24", "../2000/Translated/Reception_2000_to_2001_part25"]

const completedFileName = "../2000/Translated/Reception_2000_to_2001_All"

concat(writtenFiles, completedFileName, () => {
    console.log(`FINISHED! \n Your completed file is at ${completedFileName}`)
    process.exit()
})