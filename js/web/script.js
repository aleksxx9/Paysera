var userId;
var userType;
var operationType;
var amount;
var currency = 'EUR';
var naturalData;
var juridicalData;
var commisionData;
var globalData;
var cashInput;
var cashOutput;
var text;

function setup() {
  commision = loadJSON('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in', getCommision);
  natural = loadJSON('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural', getNatural);
  juridical = loadJSON('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical', getJuridical);
  loadData = loadJSON('all', getData);
  drawInput();
}

function drawInput() {
  var cnv = createCanvas(250, 150);
  cnv.position(190, 5);
  textSize(15);
  text = text('User ID\nUser type (natural/juridical)\nOperation name (cash_in/cash_out)\nAmount', 10, 20);
  userId = createInput('');
  userId.id('user');
  userType = createInput('');
  userType.id('type');
  operationType = createInput('');
  operationType.id('operation');
  amount = createInput('');
  amount.id('amount');
  var button = createButton('submit');
  button.id('button');
  button.mousePressed(submitData);
}

function draw() {
  if (globalData) {
    var commision;
    var length = Object.keys(globalData);
    text = '<tr><th>Date</th><th>ID</th><th>Type</th><th>Operation</th><th>Amount</th><th>Commision</th></tr>';
    for (var i = 0; i < length.length; i++) {
      text += '<tr><td>' + globalData[i].date + '</td><td>' + globalData[i].user_id + '</td><td>' + globalData[i].user_type + '</td><td>' + globalData[i].type + '</td><td>' + globalData[i].operation.amount + ' ' + globalData[i].operation.currency + '</td>';
      if (globalData[i].type === 'cash_in') {
        cashInput = globalData[i];
        cashIn();
      }
      if (globalData[i].type === 'cash_out') {
        cashOutput = globalData[i];
        cashOut();
      }
      document.getElementById("table").innerHTML = text;
    }
  }

  function cashOut() {
    if (cashOutput.user_type === 'natural') {
      if (naturalData) {
        if (cashOutput.operation.amount <= naturalData.week_limit.amount) {
          text += '<td>0</td></tr>';
        } else if (cashOutput.operation.amount > naturalData.week_limit.amount) {
          commision = (cashOutput.operation.amount - naturalData.week_limit.amount) * naturalData.percents / 100;
          commisionRounded = parseFloat(Math.round(commision * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
          text += '<td>' + commisionRounded + '</td></tr>';
        } else {
          commision = cashOutput.operation.amount * naturalData.percents / 100;
          commisionRounded = parseFloat(Math.round(commision * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
          text += '<td>' + commisionRounded + '</td></tr>';
        }
      }
    }
    else if (cashOutput.user_type === 'juridical') {
      if (juridicalData) {
        var juridicalCommision = cashOutput.operation.amount * juridicalData.percents / 100;
        if (juridicalCommision > juridicalData.min.amount) {
          commisionRounded = parseFloat(Math.round(juridicalCommision * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
          text += '<td>' + commisionRounded + '</td></tr>';
        } else {
          text += '<td>' + juridicalData.min.amount + '</td></tr>';
        }
      }
    }
  }
}

function cashIn() {
  if (commisionData) {
    commision = (cashInput.operation.amount * commisionData.percents) / 100;
    if (commision <= 5) {
      commisionRounded = parseFloat(Math.round(commision * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
      if (commisionRounded - commision < 0.0005 && commisionRounded - commision !== 0) {
        commisionRounded = commisionRounded * 1 + 0.01;
      }
      text += '<td>' + parseFloat(commisionRounded).toFixed(2) + '</td></tr>';
    } else {
      text += '<td>' + commisionData.max.amount + '</td></tr>';
    }
  }
}

function getData(data) {
  globalData = data;
}

function getCommision(data) {
  commisionData = data;
}

function getNatural(data) {
  naturalData = data;
}

function getJuridical(data) {
  juridicalData = data;
}

function submitData() {
  if ((userType.value() == 'natural' || userType.value() == 'juridical') && (operationType.value() == 'cash_in' || operationType.value() == 'cash_out')) {
    var amountRounded = parseFloat(Math.round(amount.value() * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
    loadJSON('/add/' + userId.value() + '/' + userType.value() + '/' + operationType.value() + '/' + amountRounded + '/' + currency);
  }
  location = self.location;
}

function Refresh()
{
  location = self.location;
}