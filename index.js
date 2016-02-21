var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var moniker = require('moniker');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use( require('express-subdomain-handler')({ baseUrl: 'example.com', prefix: 'myprefix', logger: true }) );

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/website-maker');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSite = new Schema({
    subdomain   : String,
    dom         : String
});

var Site = mongoose.model('Site', userSite);

var randomName = moniker.generator([moniker.noun, moniker.noun, moniker.verb]);

var concatenateHTML = function(html, css, js) {
  
}



// Routes

// Homepage -> new editor with random name
app.get('/', function(request, response) {
  response.render('pages/index', {subdomain: randomName.choose()});
});


app.get('/result', function(request, response) {
  response.render('pages/result-prod', { result: '' });
});

app.post('/myprefix/:thesubdomain/save', function(request, response) {

  var userSite = new Site({
    subdomain: request.body.subdomain,
    dom: request.body.fullDOM
  });

  Site.findOneAndUpdate({ subdomain: request.body.subdomain }, { dom: request.body.fullDOM }, function(err, user) {
    if (err) throw err;

    // we have the updated user returned to us
    console.log(user);
  });

  userSite.save(function(err) {
    if (err) throw err;
    console.log('saved: ', userSite.subdomain, userSite.dom);
  });

});


// Loads full user sites
app.get('/myprefix/:thesubdomain/', function(req, res, next){
  Site.find({ subdomain: req.params.thesubdomain }, function(err, site) {
    if (err) {
      throw err;
    } else {
      if (site[0]) {
        res.render('pages/result-prod', { result : site[0].dom });
      } else {
        res.send('no such subdomain');
      }
    }
  });
});

// Loads full user sites
app.get('/myprefix/:thesubdomain/edit', function(req, res, next){
  Site.find({ subdomain: req.params.thesubdomain }, function(err, site) {
    if (err) {
      throw err;
    } else {
      if (site[0]) {
        res.render('pages/index', { resultURL : ('/myprefix/' + req.params.thesubdomain), subdomain: req.params.thesubdomain });
      } else {
        res.send('no such subdomain');
      }
    }
  });
});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
