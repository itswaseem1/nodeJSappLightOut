var nforce = require('nforce');
var express = require('express');
var port = process.env.PORT || 8181;

var org = nforce.createConnection({
  clientId: '3MVG9d8..z.hDcPLaixKLb9ADg2ZJnksVGjG.oWg5BSAOygfztWdkGLhYmu4PVUAbUPUWyGfQ3XxU6uaFqEki',
  clientSecret: '1DAF67282722C68CBA5B7C2757FB66224C6001F75C84084F5B64BE50B59448DE',
  redirectUri: 'https://salesforceactivity.herokuapp.com/oauth/_callback',
  apiVersion: 'v34.0',  // optional, defaults to current salesforce API version
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var app = express();

// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.redirect(org.getAuthUri());
});

app.get('/oauth/_callback', function(req, res) {
  org.authenticate({code: req.query.code}, function(err, resp){
    if(!err) {
      console.log('Access Token: ' + resp.access_token);
      app.locals.oauthtoken = resp.access_token;
      app.locals.lightningEndPointURI = "https://waseemcom-dev-ed.lightning.force.com";
      res.redirect('/home');
    } else {
      console.log('Error: ' + err.message);
    }
  });
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);