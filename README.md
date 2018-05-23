# NorthCoders News BackEnd

This JavaScript project uses the Express npm package in the Node environment to set up a server which connects to a MongoDB database using the Mongoose library.  The database connected to is either northcoders_news or northcoders_news_test, depending on whether the project is running in the test or dev environment.  

The seed file (./seed/seed.js) contains a seed function with four parameters which takes four separate arrays of JSON objects containing data about users, topics, articles & comments.  The seed file can be run either via the test file (./spec/main.spec.js) or via the dev file (./seed/devSeed.js). If called from the test file, the arguments passed to the seed function are arrays of JSON objects contained in files in the testData folder.  If run from the dev file, the data passed as arguments are contained in the devData folder.  The seed file uses four models for each of users, topics, articles & comments conforming to four MongoDB schemas, contained in the project's models folder.  The seed file first drops the existing database it is connected to (either the northcoders_news or northcoders_news_test database, depending on whether the seed file is being called in the test or dev environment).  It then manipulates data required in from either the testData or devData files and then saves the data to the appropriate collection in either the northcoders_news or northcoders_news_test database.

When the server is run (the ./listen.js file which can be run via the script npm run dev - see package.json) it is set to listen and responds to different HTTP requests to various /api endpoints with (arrays of) JSON objects about users, topics, artices & comments. The /api route (which responds with a basic html index page (./public/index.html) shows a list of all the endpoints and information about the data which will be returned. The server responds to requests to the endpoints via an api router which further routes to individual users, topics, articles & comments routers.  These routers in turn refer to their corresponding controller files.  The controller files call functions in their respective queries folders.  The query functions interact with the MongoDB database using models which have Mongoose methods to query the database with.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1.  A Code Editor: You will need a code editor to run the project, such as VSCode or Atom.

2.  Node 

3.  NPM (Node Package Manager)

4.  MongoDB 

5.  Mongoose

### Installing

A step by step series of examples that tell you have to get a development env running

#### 1. Download the project from Github
1. On the command line, from the folder where you wish to store the repository, enter:

```git clone https://github.com/Chenerywoman/BE-PT-northcoders-news.git```

2. Fork the project from Github by clicking on the Fork button on the top right-hand side of the screen.

#### 2. Install node 

1. To check if you already have node installed, run this command in your terminal:

```node -v```

2. If node is not installed, follow the instructions at [https://nodejs.org/en/]

#### 3. Use NPM

1. Npm is distributed with Node.js- which means that when you download Node.js, you automatically get npm installed on your computer.

2. To confirm you have npm installed, run the following command in your terminal:

```npm -v```

#### 4. Install MongoDB

1. Follow the instructions to install MongoDB https://docs.mongodb.com/manual/installation/

#### 5. Run NPM install

1. To install all the necessary npm packages (including Mongoose) to run the project, run this command in your terminal from the root of your project:

``` npm install```

#### 6. Set up a config folder

1. Set up a config folder in the root of the project

```mkdir config```

2. Make 3 files in the config folder: dev.js, test.js & index.js. Index.js refers to either the dev or test file, depending on whether process.env.NODE_ENV is set to either 'test' or 'dev'.

```touch dev.js``` etc

3. Add the following code to each of the files:

**index.js**
```module.exports = require(`./${process.env.NODE_ENV}.js`);```

**test.js**
```module.exports = 'mongodb://localhost:27017/northcoders_news_test';```

**dev.js**
```module.exports = 'mongodb://localhost:27017/northcoders_news_test';```

#### 7. Use NPM scripts to run the project

The following scripts (from the package.json scripts section) can be used in the command line to run the project:

  * To seed the dev version of the database: ```npm run seedDev```
  * To run the server: ```npm run dev```

Once the database has been seed and the server is up and running, it should respond to each of the endpoints listed at /api (contained in .public/index.html)

## Running the tests

The test file for the project is ./spec/main.spec.js

To seed the test database & run the tests ```npm test```

# Break down into end to end tests

Explain what these tests test and why

Give an example

## Deployment
Add additional notes about how to deploy this on a live system

## Built With
Node
Express
Mongoose
Supertest
bodyparser

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

Versioning
We use SemVer for versioning. For the versions available, see the tags on this repository.

## Authors
Billie Thompson - Initial work - PurpleBooth
See also the list of contributors who participated in this project.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments
Hat tip to anyone who's code was used
Inspiration
etc