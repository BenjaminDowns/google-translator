# google-translator 
####(or "Super-Dissertation 3000")

A node.js translator to bulk translate using the google translate API without exceeding free API limits.

## How to use

### Step 0: clone the repo
`git clone https://github.com/BenjaminDowns/google-translator.git`

### Step 1: Install dependencies
`npm install`

### Step 2: Create config.json (see 'sampleconfig.json' in the repository for an example)
NOTE: You will need a [GoogleTranslate API key](https://cloud.google.com/translate/docs/)
(see "Details" below)

### Step 3: run it
`node translator.js`

## Details:

See the sampleconfig.json to set up your config.json. The config.json needs, at the very least, your googletranslate API key. You should also designate your `source` (the text to be translated). This translator splits the file to keep each call to the GoogleTranslate API under the maximum number of characters allowed, so it will write partials in addition to a final, completed version of the translation. These are the `partialsDestination` (the path and file name to be written) and `completedDestination` (the path and file name of the completed and combined file).

Each `partialsDestination` will have "part

### Using from the command line 

You may also designate `source`, `partialsDestination` and `completedDestination` from the commandline as follows:

`node translator.js <source> <partialsDestination> <completedDestination>`