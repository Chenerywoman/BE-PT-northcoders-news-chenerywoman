// need to set this before requiring app or will be undefined & app will change it to 'dev' on line 3
// this will set the app to connect to the test database
process.env.NODE_ENV = 'test';
const app = require('../app');
const mongoose = require('mongoose');
// supertest is called with the app
const request = require('supertest')(app);
const expect = require('chai').expect;
// seed file to be called below with test data
const { seed } = require('../seed/seed');
// this brings in the test data, which are passed as arguments to the seed function below
const { articles, comments, topics, users } = require('../seed/testData');

describe('API endpoints', () => {
    let topicDocs, userDocs, articleDocs, commentDocs
    before(() => {
        return seed(topics, users, articles, comments)
            .then(data => {
                [topicDocs, userDocs, articleDocs, commentDocs] = data;
            })
    });
    // disconnects from the db when the entire test file has run
    after(() => { mongoose.disconnect(); })

    describe('API requests to api/topics', () => {
        it('GETs all topics from api/topics', () => {
            return request
                .get('/api/topics')
                .then(res => {
                    expect(res.body.topics).to.be.an('array');
                    expect(res.body.topics.length).to.equal(3);
                    expect(res.body.topics[0]).to.have.keys('_id', 'title', 'slug', '__v');
                    expect(res.body.topics[0].title).to.equal('Mitch');
                });
        });
        it('GETs all articles for a topic from api/topics/:topic_id/articles', () => {
            return request
                .get(`/api/topics/${topicDocs[0]._id}/articles`)
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.length).to.equal(2);
                    expect(res.body.articles[0]).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes', '__v');
                    expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man');
                });
        });
        it('returns an appropriate error message if non-existent topic id inputted', () => {
            return request
                .get('/api/topics/3339999222/articles')
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.eql({ error: 'please input a valid topic id' });
                    expect(res.body.error).to.equal('please input a valid topic id');
                });
        });
        it('returns an appropriate error message if there are no articles for a topic', () => {
            return request
                .get(`/api/topics/${topicDocs[2]._id}/articles`)
                .then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body).to.eql({ error: `there are no articles for the topic with id ${topicDocs[2]._id}` });
                    expect(res.body.error).to.equal(`there are no articles for the topic with id ${topicDocs[2]._id}`);
                });
        });
        it('POSTs a new article to api/topics:topic_id/articles', () => {
            return request
                .post(`/api/topics/${topicDocs[2]._id}/articles`)
                .set('Accept', 'application/json')
                .send({ title: 'Why I love Penguins', body: 'blah, blah, Penguins, blah, more penguins, love them', belongs_to: topicDocs[2]._id, created_by: userDocs[1]._id })
                .then(res => {
                    expect(res.status).to.equal(201);
                    expect(res.body).to.eql({});
                    expect(res.body.error).to.equal('unable to post article');
                });
        });
    });
    describe('API requests to api/articles', () => {
        it('GETs all articles from api/articles', () => {
            return request
                .get('/api/articles')
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.length).to.equal(5);
                    expect(res.body.articles[3]).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes', '__v');
                    expect(res.body.articles[3].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
                });
        });
        it('GETs an article by id from api/articles:article_id', () => {
            return request
                .get(`/api/articles/${articleDocs[1]._id}`)
                .then(res => {
                    expect(res.body.article).to.be.an('object');
                    expect(res.body.article).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes', '__v');
                    expect(res.body.article.title).to.equal('7 inspirational thought leaders from Manchester UK');
                });
        });
        it('returns an appropriate error message if non-existent article id inputted', () => {
            return request
                .get('/api/articles/3339999222')
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.eql({ error: 'please input a valid article id' });
                    expect(res.body.error).to.equal('please input a valid article id');
                });
        });
        it('GETs all comments for an article from api/articles/:article_id/comments', () => {
            return request
                .get(`/api/articles/${articleDocs[2]._id}/comments`)
                .then(res => {
                    expect(res.body.comments).to.be.an('array');
                    expect(res.body.comments.length).to.equal(2);
                    expect(res.body.comments[0]).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                    expect(res.body.comments[0].body).to.equal('The owls are not what they seem.');
                });
        });
        it('returns an appropriate response if there are no comments for an article', () => {
            return request
                .get(`/api/articles/${articleDocs[4]._id}/comments`)
                .then(res => {
                    expect(res.body).to.eql({ error: `there are no comments for the article with id ${articleDocs[4]._id}` });
                    expect(res.body.error).to.equal(`there are no comments for the article with id ${articleDocs[4]._id}`);
                });
        });
    });
    describe('API requests to api/users', () => {
        it('GETs all users from api/users', () => {
            return request
                .get('/api/users')
                .then(res => {
                    expect(res.body.users).to.be.an('array');
                    expect(res.body.users.length).to.equal(2);
                    expect(res.body.users[0]).to.have.keys('_id', '__v', 'avatar_url', 'name', 'username');
                    expect(res.body.users[0].username).to.equal('butter_bridge');
                });
        });
        it('GETs a user by username from api/users/username/:username', () => {
            return request
                .get(`/api/users/username/${userDocs[1].username}`)
                .then(res => {
                    expect(res.body.user).to.be.an('object');
                    expect(res.body.user).to.have.keys('_id', '__v', 'avatar_url', 'name', 'username');
                    expect(res.body.user.username).to.equal('dedekind561');
                });
        });
        it('returns an appropriate error message if non-existent username inputted', () => {
            return request
                .get('/api/users/username/3339999222')
                .then(res => {
                    expect(res.status).to.equal(404);
                    expect(res.body).to.eql({ error: 'username does not exist' });
                    expect(res.body.error).to.equal('username does not exist');
                });
            })
            it('GETs a user by id from api/users:id', () => {
                return request
                    .get(`/api/users/${userDocs[1].id}`)
                    .then(res => {
                        expect(res.body.user).to.be.an('object');
                        expect(res.body.user).to.have.keys('_id', '__v', 'avatar_url', 'name', 'username');
                        expect(res.body.user.username).to.equal('dedekind561');
                    });
            });
            it('returns an appropriate error message if non-existent id inputted', () => {
                return request
                    .get('/api/users/3339999222')
                    .then(res => {
                        expect(res.status).to.equal(400);
                        expect(res.body).to.eql({ error: 'please input a valid user id' });
                        expect(res.body.error).to.equal('please input a valid user id');
                    });
            });

        });



});
