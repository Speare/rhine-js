function Rhine(apikey, ssl) {
	if(!apikey) throw "ERR: Please supply an apikey";
	ssl = typeof ssl !== 'undefined' ? ssl : false;
	
	this.apikey = apikey;
	this.ssl = ssl;
	this._name = "rhine";
}

Rhine.prototype.toString = function() {
	return 'RhineInstance<apikey:' + this.apikey + '>';
};

Rhine.prototype.run = function(request, onsuccess, onerror) {
    var k = Object.keys(request)[0];
	var http = new XMLHttpRequest();
	http.open("POST", "https://api.rhine.io", true);
	// http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	// timeouts
	http.timeout = 10000;
    http.ontimeout = onerror;

	http.send(JSON.stringify({'request': {'method': request, 'key': this.apikey}}));
	http.onload = function (e) {
		onsuccess(JSON.parse(http.response).success[k]);
	}
	
	http.onerror = function(e) {
		onerror(JSON.parse(http.response))
	}
}

Rhine.prototype.run_sync = function(request) {
    var k = Object.keys(request)[0];
	var http = new XMLHttpRequest();
	http.open("POST", "https://api.rhine.io", false);
	http.send(JSON.stringify({'request': {'method': request, 'key': this.apikey}}));
	return JSON.parse(http.response).success[k];
}

Rhine.prototype.pipeline = function(requests, onsucc, onerr) {
  var ks = []
  for (i = 0; i < requests.length; i++) 
  ks.push(Object.keys(requests[i]));
  this.run({'pipelined': requests}, function(d) { var x = []; for (i = 0; i < d.length; i++) { x.push(d[i][ks[i]]); }; onsucc(x); }, onerr);
}

Rhine.prototype.pipeline_sync = function(requests, onsucc, onerr) {
  var ks = []
  for (i = 0; i < requests.length; i++) 
  ks.push(Object.keys(requests[i]));
  var rs = this.run({'pipelined': requests});
  var x = [];
  for (i = 0; i < rs.length; i++) {
  	x.push(rs[i][ks[i]]);
  }
  return x;
}

var rhine = {
	subclass 	: function(e1, e2) 	{ return { 'subclass' 	: [e1, e2] }; }, 
	distance 	: function(e1, e2) 	{ return { 'distance' 	: [e1, e2] }; }, 
	equivalence	 	: function(e1, e2) 	{ return { 'equivalence': [e1, e2] }; }, 
	
	extract	 	: function(e) 		{ return { 'extract' 	: e }; }, 
	grouped	 	: function(e) 		{ return { 'grouped' 	: e }; }, 
	text	 	: function(e) 		{ return { 'text' 		: e }; }, 
	entity	 	: function(e) 		{ return { 'entity' 	: e }; }, 

	article		: {
		fromurl : function(e) 		{ return { 'article' 	: { 'fromurl' : e}}; }
	},

	image 		: {
		fromurl : function(e) 		{ return { 'image' 		: { 'fromurl' : e}}; }
	},
}