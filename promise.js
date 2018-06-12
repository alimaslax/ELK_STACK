const express = require('express');
const app = express();
var rp = require('request-promise');
var data = [];

var getCount = function (req){
var query = {
  "size": 0,
"aggs": {
          "sum": {
            "terms": {
              "field": req+".keyword",
              "size":500
            }
          }
}
};
var options = {
    method: 'POST',
    headers: {'content-type' : 'application/json'},
    uri: 'http://35.196.134.152/search/crime/_search',
    body: query,
    json: true // Automatically stringifies the body to JSON
};
return rp(options)
    .then(function (parse) {
      data.push(parse.aggregations.sum.buckets);
       return(parse.aggregations.sum.buckets);
    })
    .catch(function (err) {
        // POST failed...
    });
}
function promise(x) { 
  return new Promise(resolve => {
    resolve(getCount(x));
  });
}
app.listen(3000, () => console.log('Example app listening on port 3000!'));

// GET method route
app.get('/', function (req, res) {
 var promise1 = promise("OFFENSE_DESCRIPTION").then((val) => {});
 var promise2 = promise("SHOOTING").then((val) => {});
 var promise3 = promise("DISTRICT").then((val) => {});
 var promise4 = promise("YEAR").then((val) => {});
 var promise5 = promise("DAY_OF_WEEK").then((val) => {});
 var promise6 = promise("OFFENSE_CODE").then((val) => {});

 Promise.all([promise1, promise2, promise3, promise4, promise5, promise6]).then((val) => {
   console.log(data);
   write(data);});
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
})
var fs = require('fs');

function write(data) {
  fs.writeFile("test", JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
}
