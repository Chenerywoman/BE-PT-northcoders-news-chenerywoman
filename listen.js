const app = require('./index');

app.listen(3000, function (err) {if (err) 
  return console.log(err);
  console.log('App listening on port 3000');
});
