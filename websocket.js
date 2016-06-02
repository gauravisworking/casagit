module.exports = {
	initWebSocketServer : function () {
		
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
			
			ioClient.on('authenticated', function () {
				console.log('authenticated');
				ioClient.on('newUserJoined', function (msg) {
					
					var newPacket = {
						topic : 'espGroup',
						payload : 'STAT',
						retain : false,
						qos : 0
					};
					pubSubServer.publish(newPacket, function () {});
					
					console.log('New user is online : ', msg);
					var newPacket = {
						topic : 'espGroup',
						payload : 'STAT',
						retain : false,
						qos : 0
					};
					pubSubServer.publish(newPacket, function () {});
					
				});
				ioClient.on('registrationID', function (data) {
					console.log(data);
				});
				ioClient.on('recieve', function (data) {
					console.log('form other deviec', data);
					
					try {
						var request = JSON.parse(data);
						
						if (request.performAction) {
							var newPacket = {
								topic : request.topic,
								payload : request.action,
								retain : false,
								qos : 0
							};
							pubSubServer.publish(newPacket, function () {});
						} else if (request.stat) {}
						
					} catch (e) {
						console.log('Error in parsing : ', data);
						
					}
					
				})
			});
			
			ioClient.on('disconnect', function () {
				console.log('  -  -  -  disconnected');
			});
			
			ioClient.on('unauthorized', function (err) {
				console.log("There was an error with the authentication:", err.message);
			});
		});
	}
}
