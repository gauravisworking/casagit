module.exports = {
	startCloudConnections : function() {

		cloudServerClient = require('socket.io-client')('wss://websocket-hometesting.rhcloud.com:8443', {
					query : "foo=bar"
				});
		
		cloudServerClient.on('newUserJoined', function (msg) {
			
			var newPacket = {
				topic : 'espGroup',
				payload : 'STAT',
				retain : false,
				qos : 0
			};
			pubSubServer.publish(newPacket, function () {});
			
			cloud_client_logger.info('New user is online : ', msg);
			
			
		});
		
		cloudServerClient.on('recieve', function (data,callback) {
			cloud_client_logger.info('form other deviec', data);
			var ackObj = {
						ack : true,
						jobId : data.jobId
					}
			callback(ackObj);
			try {
				var request = data;
				
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
				cloud_client_logger.error('Error in parsing : ', data);
				
			}
			
		})
		
		
		cloudServerClient.on('houseIPUpdates', function(data) {
			cloud_client_logger.debug('HouseIp : ', data);
			housePublicIP = data.housePublicIP;
			
			selfConnection = require('socket.io-client')('ws://' + '192.168.0.104' + ':8085', {
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

			var lastTime = null;
			selfConnection.on('connect', function() {
				cloud_client_logger.info('Self connection established in '+(new Date().getTime() - lastTime)/1000+"sec");
				selfConnection.emit('authentication', authenticationObj);
			});

			selfConnection.on('authenticated', function(data) {
				cloud_client_logger.info('authenticated self server : ',data);
			});

			selfConnection.on('disconnect', function() {
				lastTime = new Date().getTime();
				cloud_client_logger.error('Self connection disconnected');
				cloudServerClient.emit('registerIP', null);
			});
			
			selfConnection.on('reconnect_error', function(e) {
				//cloud_client_logger.error('Self connection reconnect_error');
			});
			

		});
		
		cloudServerClient.on('connect', function() {
			
			var authenticationObj = {
					username : 'Gaurav',
					password : 'Solanke',
					isUser : false,
					isHome : true,
					name : 'vatsalya',
					houseId : 'house_1'
				};
			
			cloud_client_logger.info('cloudServerClient connected ');
			cloudServerClient.emit('authentication', authenticationObj);
		});
		
		cloudServerClient.on('authenticated', function(data) {
			cloud_client_logger.info('cloudServerClient authenticated ', data);
			cloudServerClient.emit('registerIP', null);
		});

		cloudServerClient.on('disconnect', function() {
			cloud_client_logger.error('cloudServerClient disconnected');
		});

		cloudServerClient.on('error', function(e) {
			cloud_client_logger.error('cloudServerClient error : ', e);
		});

		cloudServerClient.on('reconnect', function(number) {
			//cloud_client_logger.info('cloudServerClient reconnect : ', number);
		});

		cloudServerClient.on('reconnect_attempt', function() {
			//cloud_client_logger.info('cloudServerClient reconnect_attempt ');
		});

		cloudServerClient.on('reconnecting', function(number) {
			//cloud_client_logger.info('cloudServerClient reconnecting');
		});

		cloudServerClient.on('reconnect_error', function(e) {
			cloud_client_logger.error('cloudServerClient reconnect_error');
		});

		cloudServerClient.on('reconnect_failed', function() {
			//cloud_client_logger.error('cloudServerClient reconnect_failed');
		});

		cloudServerClient.on('unauthorized',function(err) {
			cloud_client_logger.error("There was an error with the authentication:",err.message);
		});

	}
}
