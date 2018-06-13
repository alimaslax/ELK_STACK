const express = require('express');
const app = express();
var rp_lib = require('request');
var rp = require('request-promise');
var data = [];


var getCount = function(req, url) {
  var options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    uri: url,
    body: JSON.parse(req),
    json: true // Automatically stringifies the body to JSON
  };
  rp(options)
    .then(function(parse) {
      console.log(parse);
      // data.push({[req]:parse.aggregations.sum.buckets});
      // console.log(data);
    })
    .catch(function(err) {
      console.log(err); // POST failed...
    });
}

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
  var data = {term:"YEAR",data:"2017,2018"};
  var array = [];
  array.push(data);
  var url = 'http://35.196.134.152/search/crime/_search';
  getCount(getQuery(array),url);
});

// POST method route
app.post('/', function(req, res) {
  res.send('POST request to the homepage');
})
var fs = require('fs');

function write(data) {
  fs.writeFile("test", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
}
