const express = require('express');
const app = express();
var rp_lib = require('request');
var rp = require('request-promise');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
function getQuery(arr) {
  var must='';
  if (Array.isArray(arr)){
    for(var i =0; i < arr.length; i++){
      //check if multi-match data
      if(arr[i]["data"].includes(",")){
        var temp = '';
        var array = arr[i]["data"].split(",");
        for(var j = 0; j < array.length;j++){
          temp+='{ "match" : { "'+arr[i]["term"]+'" : "'+array[j]+'" } }';
          //add coma if not end
          if(j!=array.length-1)
            temp+=',';
        }
        must+='{ "bool": { "should": [ '+temp+'] } }';
      }
      else{
        must+='{ "match" : { "'+arr[i]["term"]+'" : "'+arr[i]["data"]+'" } }';
      }
      //add coma if not end
      if(i!=arr.length-1)
        must+=',';
    }
    var query1 = '{"size":0, "query": { "constant_score": { "filter": { "bool": { "must": ['+must+'] } } } } }';
    return query1;
  }
  //not an array: Column agg
  else
    return '{ "size": 0, "aggs": { "sum": { "terms": { "field": "'+arr+'.keyword", "size":500 } } } }';
}
app.listen(3000, () => console.log('Example app listening on port 3000!'));

// GET method route
app.get('/', function(req, res) {
});

// POST method route
app.post('/', function(req, res) {
  var data = [];
  var options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    uri: 'http://35.196.134.152/search/crime/_search',
    body: JSON.parse(getQuery(req.body)),
    json: true // Automatically stringifies the body to JSON
  };
  var promise1 = rp(options)
    .then(function(parse) {
      data.push(parse);
    })
    .catch(function(err) {
      console.log(err); // POST failed...
    });

Promise.all([promise1]).then(function(values) {
    res.send(data);
  });
});
var fs = require('fs');

function write(data) {
  fs.writeFile("test", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}
