process.env.NODE_ENV = 'test';
const app = require('../app');
const mongoose = require('mongoose');
const request = require('supertest')(app);
const expect = require('chai').expect;
const { seed } = require('../seed/seed');
const { articlesData, commentsData, topicsData, usersData } = require('../seed/testData');

describe('API endpoints', () => {
    let topicDocs, userDocs, articleDocs, commentDocs;
    beforeEach(() => {
        return seed(topicsData, usersData, articlesData, commentsData)
            .then(data => {
                [topicDocs, userDocs, articleDocs, commentDocs] = data;
            });
    });
    after(() => { mongoose.disconnect(); });

    describe('API requests to api/topics', () => {
        it('GETs all topics from api/topics', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    const { topics } = res.body;
                    expect(topics.length).to.equal(3);
                    expect(topics[0].title).to.equal(topicDocs[0].title);
                    expect(topics[0].slug).to.equal(topicDocs[0].slug);
                    expect(topics[0]._id).to.equal(`${topicDocs[0]._id}`);
                    expect(topics[0]).to.have.keys('_id', 'title', 'slug', '__v');
                });
        });
        it('GETs all articles for a topic from api/topics/:topic_id/articles', () => {
            return request
                .get(`/api/topics/${topicDocs[0]._id}/articles`)
                .expect(200)
                .then(res => {
                    const { articles } = res.body;
                    expect(articles.length).to.equal(2);
                    expect(articles[0].votes).to.equal(articleDocs[0].votes);
                    expect(articles[0].title).to.equal(articleDocs[0].title);
                    expect(articles[0].body).to.equal(articleDocs[0].body);
                    expect(articles[0].belongs_to._id).to.equal(`${articleDocs[0].belongs_to}`);
                    expect(articles[0]).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes');
                });
        });
        it('returns an appropriate error message if an invalid topic id inputted as a parameter', () => {
            return request
                .get('/api/topics/3339999222/articles')
                .expect(400)
                .then(res => expect(res.body.error).to.equal('please input a valid topic id'));
        });
        it('returns an appropriate error message if there are no articles for a topic', () => {
            return request
                .get(`/api/topics/${topicDocs[2]._id}/articles`)
                .expect(404)
                .then(res => expect(res.body.error).to.equal(`there are no articles for the topic with id ${topicDocs[2]._id}`));
        });
        it('POSTs a new article to api/topics:topic_id/articles', () => {
            const newArticle = { title: 'Why I love Penguins', body: 'blah, blah, Penguins, blah, more penguins, love them', created_by: userDocs[1]._id };
            return request
                .post(`/api/topics/${topicDocs[2]._id}/articles`)
                .set('Accept', 'application/json')
                .send(newArticle)
                .expect(201)
                .then(res => {
                    const { new_article } = res.body;
                    expect(new_article.title).to.equal(newArticle.title);
                    expect(new_article.body).to.equal(newArticle.body);
                    expect(new_article.created_by).to.equal(`${newArticle.created_by}`);
                    expect(new_article).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes', '__v');
                });
        });
        it('responds with an appropriate error to a POST request if an invalid topic id is passed as a parameter', () => {
            return request
                .post('/api/topics/banana/articles')
                .set('Accept', 'application/json')
                .send({ title: 'Why I love Penguins', body: 'blah, blah, Penguins, blah, more penguins, love them', created_by: userDocs[1]._id })
                .expect(400)
                .then(res => expect(res.body.error).to.equal('banana is not a valid topic id'));
        });
        it('responds with an appropriate error to a POST request if an invalid user id is passed as in the request body', () => {
            return request
                .post(`/api/topics/${topicDocs[2]._id}/articles`)
                .set('Accept', 'application/json')
                .send({ title: 'Why I love Penguins', body: 'blah, blah, Penguins, blah, more penguins, love them', created_by: 'matilda' })
                .expect(400)
                .then(res => expect(res.body.error).to.equal('matilda is not a valid user id'));
        });
    });

    describe('API requests to api/articles', () => {
        it('GETs all articles from api/articles', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(res => {
                    const { articles } = res.body;
                    expect(articles.length).to.equal(5);
                    expect(articles[3]._id).to.equal(`${articleDocs[3]._id}`);
                    expect(articles[3].title).to.equal(articleDocs[3].title);
                    expect(articles[3].body).to.equal(articleDocs[3].body);
                    expect(articles[3].belongs_to._id).to.equal(`${articleDocs[3].belongs_to}`);
                    expect(articles[3]).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes', 'comments');
                    expect(articles[3].created_by).to.have.keys('_id', 'username');
                    expect(articles[3].belongs_to).to.have.keys('_id', 'title');
                    expect(articles[3].comments).to.be.a('number');
                });
        });
        it('GETs an article by id from api/articles:article_id', () => { 
            return request
                .get(`/api/articles/${articleDocs[1]._id}`)
                .expect(200)
                .then(res => {
                    const { article } = res.body;
                    expect(article._id).to.equal(`${articleDocs[1]._id}`);
                    expect(article.title).to.equal(articleDocs[1].title);
                    expect(article.body).to.equal(articleDocs[1].body);
                    expect(article.created_by._id).to.equal(`${articleDocs[1].created_by}`);
                    expect(article.belongs_to._id).to.equal(`${articleDocs[1].belongs_to}`);
                    expect(article.votes).to.equal(articleDocs[1].votes);
                    expect(article).to.have.keys('_id', 'title', 'created_by', 'body', 'belongs_to', 'votes', 'comments');
                    expect(article.created_by).to.have.keys('_id', 'username');
                    expect(article.belongs_to).to.have.keys('_id', 'title');
                });
        });
        it('returns an appropriate error message if non-existent article id inputted', () => {
            return request
                .get('/api/articles/3339999222')
                .expect(400)
                .then(res => expect(res.body.error).to.equal('please input a valid article id'));
        });
        it('GETs all comments for an article from api/articles/:article_id/comments', () => {
            return request
                .get(`/api/articles/${articleDocs[2]._id}/comments`)
                .expect(200)
                .then(res => {
                    const { comments } = res.body;
                    expect(comments.length).to.equal(2);
                    expect(comments[0]._id).to.equal(`${commentDocs[2]._id}`);
                    expect(comments[0].created_by._id).to.equal(`${commentDocs[2].created_by}`);
                    expect(comments[0].body).to.equal(commentDocs[2].body);
                    expect(comments[0].belongs_to._id).to.equal(`${commentDocs[2].belongs_to}`);
                    expect(comments[0].votes).to.equal(commentDocs[2].votes);
                    expect(comments[0]).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', 'created_at');
                    expect(comments[0].created_by).to.have.keys('_id', 'username');
                    expect(comments[0].belongs_to).to.have.keys('_id', 'title');
                });
        });
        it('returns an appropriate response if there are no comments for an article', () => {
            return request
                .get(`/api/articles/${articleDocs[4]._id}/comments`)
                .expect(404)
                .then(res => expect(res.body.error).to.equal(`there are no comments for the article with id ${articleDocs[4]._id}`));
        });
        it('POSTs a new comment to api/articles:article_id/comments', () => {
            const newComment = { body: 'personally I\'d rather have a nice cup of tea', created_by: userDocs[1]._id };
            return request
                .post(`/api/articles/${articleDocs[2]._id}/comments`)
                .set('Accept', 'application/json')
                .send(newComment)
                .expect(201)
                .then(res => {
                    const { new_comment } = res.body;
                    expect(new_comment.body).to.equal(newComment.body);
                    expect(new_comment.created_by).to.equal(`${newComment.created_by}`);
                    expect(new_comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                });
        });
        it('responds with an appropriate error to a POST request if an invalid article id is passed as a parameter', () => {
            return request
                .post('/api/articles/bubbly21/comments')
                .set('Accept', 'application/json')
                .send({ body: 'blah, blah, I am very impressed, blah.....', created_by: userDocs[1]._id })
                .expect(400)
                .then(res => expect(res.body.error).to.equal('bubbly21 is not a valid article id'));
        });
        it('responds with an appropriate error to a POST request if an invalid user id is passed as in the request body', () => {
            return request
                .post(`/api/articles/${topicDocs[2]._id}/comments`)
                .set('Accept', 'application/json')
                .send({ body: 'must get my wand mended', created_by: 'Harry Potter' })
                .expect(400)
                .then(res => expect(res.body.error).to.equal('Harry Potter is not a valid user id'));
        });
        it('makes a PUT request to increase the votes to api/articles:article_id', () => {
            return request
                .put(`/api/articles/${articleDocs[2]._id}`)
                .set('Accept', 'application/json')
                .query({ vote: 'up' })
                .expect(200)
                .then(res => {
                    const { updated_article } = res.body;
                    expect(updated_article).to.have.keys('_id', 'created_by', 'body', 'comments', 'belongs_to', 'votes', '__v', 'title');
                    expect(updated_article.votes).to.equal(articleDocs[2].votes + 1);
                });
        });
        it('makes a PUT request to decrease the votes to api/articles:article_id', () => {
            return request
                .put(`/api/articles/${articleDocs[2]._id}`)
                .set('Accept', 'application/json')
                .query({ vote: 'down' })
                .expect(200)
                .then(res => {
                    const { updated_article } = res.body;
                    expect(updated_article).to.have.keys('_id', 'created_by', 'body', 'comments', 'belongs_to', 'votes', '__v', 'title');
                    expect(updated_article.votes).to.equal(articleDocs[2].votes - 1);
                });
        });
        it('responds with an appropriate error to a PUT request if an invalid user id is passed as in the request body', () => {
            return request
                .put('/api/articles/voldemort')
                .set('Accept', 'application/json')
                .query({ vote: 'down' })
                .expect(400)
                .then(res => expect(res.body.error).to.equal('voldemort is not a valid article id'));
        });
        it('responds with an unchanged article to a PUT request if the "vote" query string parameter is not "up" or "down"', () => {
            return request
                .put(`/api/articles/${articleDocs[2]._id}`)
                .set('Accept', 'application/json')
                .query({ vote: 'banana' })
                .expect(200)
                .then(res => {
                    const { updated_article } = res.body;
                    expect(updated_article).to.have.keys('_id', 'created_by', 'body', 'comments', 'belongs_to', 'votes', '__v', 'title');
                    expect(updated_article.votes).to.equal(articleDocs[2].votes);
                });
        });
        it('responds with an unchanged article to a PUT request if the query string parameter is not "vote"', () => {
            return request
                .put(`/api/articles/${articleDocs[4]._id}`)
                .set('Accept', 'application/json')
                .query({ july: 'up' })
                .expect(200)
                .then(res => {
                    const { updated_article } = res.body;
                    expect(updated_article).to.have.keys('_id', 'created_by', 'body', 'comments', 'belongs_to', 'votes', '__v', 'title');
                    expect(updated_article.votes).to.equal(articleDocs[4].votes);
                });
        });
    });

    describe('API requests to api/users', () => {
        it('GETs all users from api/users', () => {
            return request
                .get('/api/users')
                .expect(200)
                .then(res => {
                    const { users } = res.body;
                    expect(users.length).to.equal(2);
                    expect(users[0].username).to.equal(userDocs[0].username);
                    expect(users[0].avatar_url).to.equal(userDocs[0].avatar_url);
                    expect(users[0].name).to.equal(userDocs[0].name);
                    expect(users[0]._id).to.equal(`${userDocs[0]._id}`);
                    expect(users[0]).to.have.keys('_id', '__v', 'avatar_url', 'name', 'username');
                });
        });
        it('GETs a user by username from api/users/username/:username', () => {
            return request
                .get(`/api/users/${userDocs[1].username}`)
                .expect(200)
                .then(res => {
                    const { user } = res.body;
                    expect(user.username).to.equal(userDocs[1].username);
                    expect(user._id).to.equal(`${userDocs[1]._id}`);
                    expect(user.avatar_url).to.equal(userDocs[1].avatar_url);
                    expect(user.name).to.equal(userDocs[1].name);
                    expect(user.username).to.equal(userDocs[1].username);
                    expect(user).to.have.keys('_id', '__v', 'avatar_url', 'name', 'username');
                });
        });
        it('returns an appropriate error message if non-existent username inputted', () => {
            return request
                .get('/api/users/3339999222')
                .expect(404)
                .then(res => expect(res.body.error).to.equal('username does not exist'));
        });
        it('GETs a user by id from api/users/id/:id', () => {
            return request
                .get(`/api/users/id/${userDocs[1]._id}`)
                .expect(200)
                .then(res => {
                    const { user } = res.body;
                    expect(user._id).to.equal(`${userDocs[1]._id}`);
                    expect(user.avatar_url).to.equal(userDocs[1].avatar_url);
                    expect(user.name).to.equal(userDocs[1].name);
                    expect(user.username).to.equal(userDocs[1].username);
                    expect(user).to.have.keys('_id', '__v', 'avatar_url', 'name', 'username');
                });
        });
        it('returns an appropriate error message if non-existent id inputted', () => {
            return request
                .get('/api/users/id/banana')
                .expect(400)
                .then(res => expect(res.body.error).to.equal('please input a valid user id'));
        });
    });

    describe('API requests to api/comments', () => {
        it('GETs all comments in response to a request from api/comments', () => {
            return request
                .get('/api/comments')
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const { comments } = res.body;
                    expect(comments.length).to.equal(8);
                    expect(comments[3]._id).to.equal(`${commentDocs[3]._id}`);
                    expect(comments[3].created_by._id).to.equal(`${commentDocs[3].created_by}`);
                    expect(comments[3].body).to.equal(commentDocs[3].body);
                    expect(comments[3].belongs_to._id).to.equal(`${commentDocs[3].belongs_to}`);
                    expect(comments[3].votes).to.equal(commentDocs[3].votes);
                    expect(comments[3].belongs_to).to.have.keys('_id', 'title');
                    expect(comments[3]).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', 'created_at');
                    expect(comments[3].created_by).to.have.keys('_id', 'username');
                    expect(comments[3].belongs_to).to.have.keys('_id', 'title');
                });
        });
        it('GETs a comment by it\'s id from api/comments:comment_id', () => {
            return request
                .get(`/api/comments/${commentDocs[4]._id}`)
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const { comment } = res.body;
                    expect(comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', 'created_at');
                    expect(comment._id).to.equal(`${commentDocs[4]._id}`);
                    expect(comment.created_by._id).to.equal(`${commentDocs[4].created_by}`);
                    expect(comment.body).to.equal(commentDocs[4].body);
                    expect(comment.belongs_to._id).to.equal(`${commentDocs[4].belongs_to}`);
                    expect(comment.votes).to.equal(commentDocs[4].votes);
                    expect(comment.created_by).to.have.keys('_id', 'username');
                    expect(comment.belongs_to).to.have.keys('_id', 'title');
                });
        });
        it('responds with an appropriate error to a GET request with an invalid comment id', () => {
            return request
                .get('/api/comments/lucyliu21')
                .set('Accept', 'application/json')
                .expect(400)
                .then(res => expect(res.body.error).to.equal('lucyliu21 is not a valid comment id'));
        });
        it('makes a PUT request to increase the votes to api/comments:comment_id', () => {
            return request
                .put(`/api/comments/${commentDocs[6]._id}`)
                .set('Accept', 'application/json')
                .query({ vote: 'up' })
                .expect(200)
                .then(res => {
                    const { updated_comment } = res.body;
                    expect(updated_comment.votes).to.equal(commentDocs[6].votes + 1);
                    expect(updated_comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                });
        });
        it('makes a PUT request to decrease the votes to api/comments:comment_id', () => {
            return request
                .put(`/api/comments/${commentDocs[6]._id}`)
                .set('Accept', 'application/json')
                .query({ vote: 'down' })
                .expect(200)
                .then(res => {
                    const { updated_comment } = res.body;
                    expect(updated_comment.votes).to.equal(commentDocs[6].votes - 1);
                    expect(updated_comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                });
        });
        it('responds with an appropriate error to a PUT request with an invalid comment id', () => {
            return request
                .put('/api/comments/lucyliu21')
                .set('Accept', 'application/json')
                .query({ vote: 'down' })
                .expect(400)
                .then(res => expect(res.body.error).to.equal('lucyliu21 is not a valid comment id'));
        });
        it('responds with the unchanged comment to a PUT request if the "vote" query string parameter is not "up" or "down"', () => {
            return request
                .put(`/api/comments/${commentDocs[6]._id}`)
                .set('Accept', 'application/json')
                .query({ vote: 'banana' })
                .expect(200)
                .then(res => {
                    const { updated_comment } = res.body;
                    expect(updated_comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                    expect(updated_comment.votes).to.equal(16);
                    expect(updated_comment.body).to.equal(commentDocs[6].body);
                    expect(updated_comment.votes).to.eql(commentDocs[6].votes);
                });
        });
        it('responds with the unchanged comment to a PUT request if the query string parameter is not "vote"', () => {
            return request
                .put(`/api/comments/${commentDocs[2]._id}`)
                .set('Accept', 'application/json')
                .query({ july: 'up' })
                .expect(200)
                .then(res => {
                    const { updated_comment } = res.body;
                    expect(updated_comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                    expect(updated_comment.votes).to.equal(20);
                    expect(updated_comment.body).to.equal(commentDocs[2].body);
                    expect(updated_comment.votes).to.eql(commentDocs[2].votes);
                });
        });
        it('DELETEs a comment when receiving a DELETE request to api/comments/:comment_id', () => {
            return request
                .delete(`/api/comments/${commentDocs[2]._id}`)
                .set('Accept', 'application/json')
                .expect(200)
                .then(res => {
                    const { deleted_comment } = res.body;
                    expect(deleted_comment).to.have.keys('_id', 'created_by', 'body', 'belongs_to', 'votes', '__v', 'created_at');
                    expect(deleted_comment.votes).to.equal(20);
                    expect(deleted_comment.body).to.equal(commentDocs[2].body);
                    expect(deleted_comment.votes).to.eql(commentDocs[2].votes);
                }).then(() => {
                    return request
                        .delete(`/api/comments/${commentDocs[2]._id}`)
                        .set('Accept', 'application/json')
                        .expect(404)
                        .then(res => {
                            expect(res.body.error).to.equal(`comment with id ${commentDocs[2]._id} does not exist`);
                        });
                });
        });
        it('responds with an appropriate error to a DELETE request if an invalid comment id is passed to /api/comments/:comment_id', () => {
            return request
                .delete('/api/comments/lucyliu21')
                .set('Accept', 'application/json')
                .expect(400)
                .then(res => expect(res.body.error).to.equal('lucyliu21 is not a valid comment id'));
        });
    });

});
