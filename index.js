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
    dom         : String,
    editorCode: {
      html: String,
      css: String,
      js: String
    }
});

var Site = mongoose.model('Site', userSite);

var randomName = moniker.generator([moniker.noun, moniker.noun, moniker.verb]);

// Routes

app.get('/result', function(request, response) {
  response.render('pages/result-prod', { result: '' });
});

// Saves new sites and updates existing ones
app.post(['*/save'], function(request, response) {
  var update = {
    subdomain: request.body.subdomain,
    dom: request.body.fullDOM,
    editorCode: {
      html: request.body.editorCode.html,
      css: request.body.editorCode.css,
      js: request.body.editorCode.js
    }
  }
  Site.findOneAndUpdate({ subdomain: request.body.subdomain }, update, { upsert: true }, function(err, site) {
    if (err) {
      response.send(err)
      throw err;
    } else {
        response.send('saved')
    }
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

// Homepage -> new editor with random name
app.get('/', function(request, response) {
  response.render('pages/index', {
    resultURL : '',
    subdomain: randomName.choose(),
    htmlCode: '',
    cssCode: '',
    jsCode: ''
  });
});

// Loads full user sites
app.get('/myprefix/:thesubdomain/edit', function(req, res, next){
  Site.find({ subdomain: req.params.thesubdomain }, function(err, site) {
    if (err) {
      throw err;
    } else {
      if (site[0]) {
        res.render('pages/index', {
          resultURL : ('/myprefix/' + req.params.thesubdomain),
          subdomain: req.params.thesubdomain,
          htmlCode: site[0].editorCode.html,
          cssCode: site[0].editorCode.css,
          jsCode: site[0].editorCode.javascript
        });
      } else {
        res.send('no such subdomain');
      }
    }
  });
});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
