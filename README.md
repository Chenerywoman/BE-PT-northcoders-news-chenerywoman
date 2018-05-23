# NorthCoders News BackEnd

This JavaScript project uses the Express npm package to set up a server which connects to a MongoDB database using the Mongoose library.  The database connected to is either northcoders_news or northcoders_news_test, depending on whether the project is running in the test or dev environment.  

The seed file (./seed/seed.js) contains a seed function with four parameters which takes four separate arrays of JSON objects containing data about users, topics, articles & comments.  The seed file can be run either via the test file (./spec/main.spec.js) or via the dev file (./seed/devSeed.js). If called from the test file, the arguments passed to the seed function are arrays of JSON objects contained in files in the testData folder.  If run from the dev file, the data passed as arguments are contained in the devData folder.  The seed file uses four models for each of users, topics, articles & comments conforming to four MongoDB schemas, contained in the project's models folder.  The seed file first drops the existing database it is connected to (either the northcoders_news or northcoders_news_test database, depending on whether the seed file is being called in the test or dev environment).  It then manipulates data required in from either the testData or devData files and then saves the data to the appropriate collection in either the northcoders_news or northcoders_news_test database.

When the server is run (the ./listen.js file which can be run via the script npm run dev - see package.json) it is set to listen and responds to different HTTP requests to various /api endpoints with (arrays of) JSON objects about users, topics, artices & comments. The /api route (which responds with a basic html index page (./public/index.html) shows a list of all the endpoints and information about the data which will be returned. The server responds to requests to the endpoints via an api router which further routes to individual users, topics, articles & comments routers.  These routers in turn refer to their corresponding controller files.  The controller files call functions in their respective queries folders.  The query functions interact with the MongoDB database using models which have Mongoose methods to query the database with.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need a code editor to run the project, such as VSCode or Atom.

#### Downloading the project from Github
1. On the command line, from the folder where you wish to the repository, enter:
```git clone https://github.com/Chenerywoman/BE-PT-northcoders-news.git```

2. Fork the project from Github by clicking on the Fork button on the top right-hand side of the screen.

What things you need to install the software and how to install them

### Installing
??????
A step by step series of examples that tell you have to get a development env running

Say what the step will be

Give the example
And repeat

until finished

*** config file

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

# Break down into end to end tests

Explain what these tests test and why

Give an example

## Deployment
Add additional notes about how to deploy this on a live system

## Built With
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