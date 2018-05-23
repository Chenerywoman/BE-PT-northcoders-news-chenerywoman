const app = require('./app');
// sets a variable PORT with a value of 300 - for use from the local host
let PORT = 3000;

// when deploying to heroku, the node env will be production.  In that case, change the value of PORT to process.env.PORT, which heroku will recognise.
if (process.env.NODE_ENV === 'production') {PORT = process.env.PORT;}

// app will now listen either on port 3000 or the heroku port
app.listen(PORT, function (err) {if (err) 
  return console.log(err);
  console.log(`App listening on port ${PORT}`);
});
