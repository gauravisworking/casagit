module.exports = {
	startIPUpdater : function () {
		
		ioClient = require('socket.io-client')('wss://websocket-hometesting.rhcloud.com:8443', {
				query : "foo=bar"
			});
		
		var authenticationObj = {
			username : 'Gaurav',
			password : 'Solanke',
			isUser : false,
			isHome : true,
			name : 'vatsalya',
			houseId : 'house_1'
		}
		ioClient.on('connect', function () {
			console.log('connected to websocket');
			ioClient.emit('authentication', authenticationObj);
		});
		ioClient.on('authenticated', function (data) {
			console.log('authenticated');
			ioClient.emit('registerIP', null);
		});
		ioClient.on('houseIPUpdates', function (data) {
			console.log('HouseIp : ', data);
			housePublicIP = data.housePublicIP;

			selfConnection = require('socket.io-client')('ws://' + housePublicIP + ':8085', {
					query : "foo=bar"
				});
			var authenticationObj = {
				username : 'thisHome',
				password : 'isConnected',
				isUser : false,
				isHome : true,
				name : 'vatsalya',
				houseId : 'house_1'
			}
			
			selfConnection.on('connect', function () {
				console.log('connected to self server');
				selfConnection.emit('authentication', authenticationObj);
				
				
			});
			
			selfConnection.on('authenticated', function (data) {
					
					console.log('authenticated self server');
			});
				
			
			selfConnection.on('disconnect', function () {
				
				console.log('Self disconnected');
				
				ioClient.emit('registerIP', null);
			});
			
			
			
		})
		
		ioClient.on('disconnect', function () {
			console.log('ioClient disconnected');
		});
		
		ioClient.on('unauthorized', function (err) {
			console.log("There was an error with the authentication:", err.message);
		});
		
	}
}
