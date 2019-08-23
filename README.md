# U.S. Legislators Browser

This is a React app for browsing U.S. Legislators. It uses the data from https://theunitedstates.io/congress-legislators/legislators-current.json


## Build

    npm install
or

    yarn install

for installing all dependencies. ***I recommend using yarn***

## Running the app

Build the codes by running:

    npm run build

You may would change two configurations in webpack.config.js to make it as a Node server application, then start the app by running:

    npm run start:prod

Or if you use default configuration, open dist/index.html.

## Testing

First install mocha globally on your system

    yarn global add mocha

Then run:

    npm run test
    

## Author

Todd Seungyun Oh