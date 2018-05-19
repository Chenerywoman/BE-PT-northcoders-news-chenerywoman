// need to set this before requiring app or will be undefined & app will change it to 'dev' on line 3
// this will set the app to connect to the test database
process.env.NODE_ENV = 'test';  
const app = require('../app');
const mongoose = require('mongoose');
// supertest is called with the app
const request = require('supertest')(app);
const expect = require('chai').expect;
// seed file to be called below with test data
const {seed} = require('../seed/seed');
// this brings in the test data, which are passed as arguments to the seed function below
const {articles, comments, topics, users} = require('../seed/testData');

describe('API endpoints', () => {
let topicDocs, userDocs, articleDocs, commentDocs
before(() => {return seed(topics, users, articles, comments)
.then(data => {
    [topicDocs, userDocs, articleDocs, commentDocs] = data;
})
});
 // disconnects from the db when the entire test file has run
after(() => {mongoose.disconnect();})

describe('API requests to api/topics', () => {
    it('GET all topics from api/topics', () => {
        return request
        .get('/api/topics')
        .then(res => {
            expect(res.body.topics).to.be.an('array');
            expect(res.body.topics.length).to.equal(2);
            expect(res.body.topics[0]).to.have.keys('_id', 'title', 'slug', '__v');
            expect(res.body.topics[0].title).to.equal('Mitch');
        })
    })
})

});
