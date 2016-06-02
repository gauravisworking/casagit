module.exports = {
	createClient : function () {
		mongoClient = require('mongodb').MongoClient, assert = require('assert');
		
	},
	connect : function (url) {
		mongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("MongoDB >>>>>>>>>>>>>>> MongoDB connected");
		db.close();
		});
		
	}
}
