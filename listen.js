const app = require('./app');

let PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// app will now listen either on port 3000 or the heroku port
app.listen(PORT, function (err) {if (err) 
  return console.log(err);
  console.log(`App listening on port ${PORT}`);
});
