module.exports = {
	init : function (mongoConnectionString) {
		agenda = new Agenda({
				db : {
					address : mongoConnectionString
				}
			});
	},
	execute : function () {
		agenda.define('newRas', function (job, done) {
			console.log('task executed at: ' + new Date());
			done();
		});
		
		agenda.on('ready', function () {
			
			agenda.cancel({
				name : 'newRas'
			}, function (err, numRemoved) {
				console.log('Removed agenda : ' + numRemoved);
			});
			
			var rep = agenda.create('newRas');
			rep.repeatEvery('10 seconds').save();
			console.log('Agenda started at : ' + new Date());
			agenda.start();
		});
		
	}
}
