var express = require('express');
var bodyParser  = require('body-parser');
var subdomain = require('express-subdomain');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/result', function(request, response) {
  response.render('pages/result');
});

app.post('/updatePage', function(request, response) {
  response.send(request.body);

  // bitbaloon this shit https://github.com/BitBalloon/bitballoon-js

  

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
