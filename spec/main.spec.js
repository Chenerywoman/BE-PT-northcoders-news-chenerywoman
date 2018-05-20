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
        it('returns an appropriate error message if an invalid topic id inputted as a parameter', () => {
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
                .send({ title: 'Why I love Penguins', body: 'blah, blah, Penguins, blah, more penguins, love them', created_by: userDocs[1]._id })
                .then(res => {
                    expect(res.status).to.equal(201);
                    expect(res.body.new_article).to.be.an('object');
                    expect(res.body.new_article).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes', '__v');
                    expect(res.body.new_article.title).to.equal('Why I love Penguins');
                    expect(res.body.new_article.body).to.equal('blah, blah, Penguins, blah, more penguins, love them');
                });
        });
        it('responds with an appropriate error to a POST request if an invalid topic id is passed as a parameter', () => {
            return request
                .post('/api/topics/banana/articles')
                .set('Accept', 'application/json')
                .send({ title: 'Why I love Penguins', body: 'blah, blah, Penguins, blah, more penguins, love them', created_by: userDocs[1]._id })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.eql({ error: 'banana is not a valid topic id'});
                    expect(res.body.error).to.equal('banana is not a valid topic id');
                   
                });
        });
        it('responds with an appropriate error to a POST request if an invalid user id is passed as in the request body', () => {
            return request
                .post(`/api/topics/${topicDocs[2]._id}/articles`)
                .set('Accept', 'application/json')
                .send({ title: 'Why I love Penguins', body: 'blah, blah, Penguins, blah, more penguins, love them', created_by: 'matilda' })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.eql({ error: 'matilda is not a valid user id'});
                    expect(res.body.error).to.equal('matilda is not a valid user id');
                   
                });
        });
    });
    describe('API requests to api/articles', () => {
        it('GETs all articles from api/articles', () => {
            return request
                .get('/api/articles')
                .then(res => {
                    expect(res.body.articles).to.be.an('array');
                    expect(res.body.articles.length).to.equal(6);
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
        it('POSTs a new comment to api/articles:article_id/comments', () => {
            return request
                .post(`/api/articles/${articleDocs[2]._id}/comments`)
                .set('Accept', 'application/json')
                .send({ body: 'personally I\'d rather have a nice cup of tea', created_by: userDocs[1]._id })
                .then(res => {
                    expect(res.status).to.equal(201);
                    expect(res.body.new_comment).to.be.an('object');
                    expect(res.body.new_comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                    expect(res.body.new_comment.body).to.equal('personally I\'d rather have a nice cup of tea');
                });
        });
        it('responds with an appropriate error to a POST request if an invalid article id is passed as a parameter', () => {
            return request
                .post('/api/articles/bubbly21/comments')
                .set('Accept', 'application/json')
                .send({ body: 'blah, blah, I am very impressed, blah.....', created_by: userDocs[1]._id })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.eql({ error: 'bubbly21 is not a valid article id'});
                    expect(res.body.error).to.equal('bubbly21 is not a valid article id');
                   
                });
        });
        it('responds with an appropriate error to a POST request if an invalid user id is passed as in the request body', () => {
            return request
                .post(`/api/articles/${topicDocs[2]._id}/comments`)
                .set('Accept', 'application/json')
                .send({  body: 'must get my wand mended', created_by: 'Harry Potter' })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.eql({ error: 'Harry Potter is not a valid user id'});
                    expect(res.body.error).to.equal('Harry Potter is not a valid user id');
                   
                });
        });
        it('makes a PUT request to increase the votes to api/articles:article_id', () => {
            return request
                .put(`/api/articles/${articleDocs[2]._id}`)
                .set('Accept', 'application/json')
                // query string parameter
                .query({vote: 'up'})
                // supertest expect  - key on promise object
                .expect(200)
                .then(res => {
                    expect(res.body.updated_article).to.be.an('object');
                    expect(res.body.updated_article).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'title');
                    expect(res.body.updated_article.votes).to.equal(1);
                });
        });
        it('makes a PUT request to decrease the votes to api/articles:article_id', () => {
            return request
                .put(`/api/articles/${articleDocs[2]._id}`)
                .set('Accept', 'application/json')
                // query string parameter
                .query({vote: 'down'})
                // supertest expect  - key on promise object
                .expect(200)
                .then(res => {
                    expect(res.body.updated_article).to.be.an('object');
                    expect(res.body.updated_article).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'title');
                    expect(res.body.updated_article.votes).to.equal(0);
                });
        });
        it('responds with an appropriate error to a PUT request if an invalid user id is passed as in the request body', () => {
            return request
                .put('/api/articles/voldemort')
                .set('Accept', 'application/json')
                // query string parameter
                .query({vote: 'down'})
                // supertest expect  - key on promise object
                .expect(400)
                .then(res => {
                    expect(res.body).to.eql({ error: 'voldemort is not a valid article id'});
                    expect(res.body.error).to.equal('voldemort is not a valid article id');
                });
        });
        it('responds with an appropriate error to a PUT request if the "vote" query string parameter is not "up" or "down"', () => {
            return request
                .put(`/api/articles/${articleDocs[2]._id}`)
                .set('Accept', 'application/json')
                // query string parameter
                .query({vote: 'banana'})
                // supertest expect  - key on promise object
                .expect(400)
                .then(res => {
                    expect(res.body).to.eql({ error: 'query string parameter "vote" must be "up" or "down"'});
                    expect(res.body.error).to.equal('query string parameter "vote" must be "up" or "down"');
                });
        });
        it('responds with an appropriate error to a PUT request if the query string parameter is not "vote"', () => {
            return request
                .put(`/api/articles/${articleDocs[2]._id}`)
                .set('Accept', 'application/json')
                // query string parameter
                .query({july: 'up'})
                // supertest expect  - key on promise object
                .expect(400)
                .then(res => {
                    expect(res.body).to.eql({ error: 'query string parameter "vote" must be "up" or "down"'});
                    expect(res.body.error).to.equal('query string parameter "vote" must be "up" or "down"');
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
                    .get('/api/users/banana')
                    .then(res => {
                        expect(res.status).to.equal(400);
                        expect(res.body).to.eql({ error: 'please input a valid user id' });
                        expect(res.body.error).to.equal('please input a valid user id');
                    });
            });

        });

});
