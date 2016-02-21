var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
var mongoose = require('mongoose');


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


app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/result', function(request, response) {
  response.render('pages/result', { result: '' });
});

app.post('/updatePage', function(request, response) {

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


// Set up subdomain redirect
app.get('/myprefix/:thesubdomain/', function(req, res, next){
  console.log(req.params.thesubdomain);
  Site.find({ subdomain: req.params.thesubdomain }, function(err, site) {
    if (err) {
      throw err;
    } else {
      res.render('pages/result-prod', { result : site[0].dom });
    }
  });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
