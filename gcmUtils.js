module.exports = {
	startGCM : function () {
		gcm = require('node-gcm');
		sender = new gcm.Sender('AIzaSyDhuARb24CYJDknqdX8owCwz6pDyhxvh0c');
		regId = null;
	}
}
