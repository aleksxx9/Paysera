var express = require('express');
var fs = require('fs');

var text = fs.readFileSync('input.json');
var words = JSON.parse(text);

var app = express();
app.listen(3000);

app.use(express.static('web'));


function addWord(req, res) {
  var data = req.params;
  var id = data.id;
  var user = data.user;
  var amount = data.amount;
  var cash = data.cash;
  var currency = data.currency;

  data = JSON.stringify(words, null, 2);
  data = data.substring(2);
  var d = new Date().toISOString().slice(0,10);
  if ('input.json') {
    if (data !=  '') {
      fs.writeFile( 'input.json', '[ \n  { \n    "date": "' + d + '", \n    "user_id": ' + id +',\n    "user_type": "' + user + '",\n    "type": "' + cash + '", \n    "operation": {\n      "amount": ' + amount + ',\n      "currency": "' + currency + '"\n    }\n  },' + data);
    } else {
      fs.writeFile( 'input.json', '[ \n  { \n    "date": "' + d + '", \n    "user_id": ' + id +',\n    "user_type": "' + user + '",\n    "type": "' + cash + '", \n    "operation": {\n      "amount": ' + amount + ',\n      "currency": "' + currency + '"\n    }\n  }\n]' + data);
    }
  }
  res.send('added');
}

app.get('/add/:id/:user/:cash/:amount/:currency', addWord);


function sendAll(req, res) {
  res.send(words);
}

app.get('/all', sendAll);
