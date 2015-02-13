function Rhine(apikey, ssl) {
	if(!apikey) throw "ERR: Please supply an apikey";
	ssl = typeof ssl !== 'undefined' ? ssl : false;
	
	this.apikey = apikey;
	this.ssl = ssl;
	this._name = "rhine";
}

Rhine.prototype.toString = function() {
	return 'RhineInstance<user:{0}>'.format(this.username);
};

Rhine.prototype.run = function(request, onsuccess, onerror) {
	var http = new XMLHttpRequest();
	http.open("POST", "https://api.rhine.io", true);
	// http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	
	// timeouts
	http.timeout = 10000;
    http.ontimeout = onerror;

	console.log(JSON.stringify(request));
	http.send(JSON.stringify({'request': {'method': request, 'key': this.apikey}}));
	http.onload = function (e) {
		onsuccess(JSON.parse(http.response));
	}
	
	http.onerror = function(e) {
		onerror(JSON.parse(http.response))
	}
}

Rhine.prototype.pipeline = function(requests) {
	this.run({'pipelined' : requests})
}

var rhine = {
	subclass 	: function(e1, e2) 	{ return { 'subclass' 	: [e1, e2] }; }, 
	distance 	: function(e1, e2) 	{ return { 'distance' 	: [e1, e2] }; }, 
	synonym	 	: function(e1, e2) 	{ return { 'equivalence': [e1, e2] }; }, 
	
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