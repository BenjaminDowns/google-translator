# google-translator and text analyzer
####(or "Super-Dissertation 3000")

A translator and text analyzer to 1) bulk translate using the google translate API without exceeding free API limits and 2) analyze the results

## How to use

### Step 0: clone the repo
`git clone https://github.com/BenjaminDowns/google-translator.git`

### Step 1: Install dependencies
`npm install`

### Step 2: Create `config.json` that includes: 
1) path to texts to be translated and/or analyzed 
2) path to directory where file will be written
3) Google Translate API Key (https://cloud.google.com/translate/docs/)

(see `sampleconfig.json` in the repository for an example and "Details" section below)

### Step 3: run it
Translator: `node translator.js`
Analyzer: `cd analysis`; `node analysis.js`

## Details:

See the sampleconfig.json to set up your config.json. The config.json needs, at the very least, your googletranslate API key. You should also designate your `source` (the text to be translated). This translator splits the file to keep each call to the GoogleTranslate API under the maximum number of characters allowed, so it will write partials in addition to a final, completed version of the translation. These are the `partialsDestination` (the path and file name to be written) and `completedDestination` (the path and file name of the completed and combined file).

Each `partialsDestination` will have `partx` appended to it (e.g. `translated_file_part1`, `translated_file_part2`, etc...)

### Using from the command line 

You may also designate config variables from the commandline as follows:

#### for the translator:
`node translator.js <source> <partialsDestination> <completedDestination>`

#### for the analysis:
`node analysis.js <source> <destination>`