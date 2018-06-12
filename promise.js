    getData: function(query) {
      var r = axios.request({
          method: 'post',
          url: 'http://35.196.134.1592/crime/_search',
          data: query,
          responseType: 'json'
        })
        .then((response) => {
          return response.data;
        }, (error) => {});
      return r;
    },
    getCount: function(data) {
      const query = {
        "size": 0,
        "query": {
          "terms": {
            "MONTH": data
          }
        },
        "aggs": {
          "sum": {
            "terms": {
              "field": "MONTH.keyword"
            }
          }
        }
      };
      new Promise((resolve, reject) => {
        resolve(this.getData(query));
      }).then((results) => {
        for (var i in results.aggregations.sum.buckets)
          this.data.push(results.aggregations.sum.buckets[i]);
        console.log(this.data);
      });
    }
