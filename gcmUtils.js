module.exports = {
	startGCM : function () {
		gcm = require('node-gcm');
		sender = new gcm.Sender('AIzaSyDhuARb24CYJDknqdX8owCwz6pDyhxvh0c');
		gcmmessage = new gcm.Message({collapseKey: 'demo',
			priority: 'high',
			notification: {
				title: "Hello, World",
				body: "This is a notification that will be displayed ASAP."
			}});
		regId = null;
	}
}
