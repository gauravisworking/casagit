module.exports = {
	startCloudConnections : function() {

		cloudServerClient = require('socket.io-client')('wss://websocket-hometesting.rhcloud.com:8443', {
					query : "foo=bar"
				});

		var authenticationObj = {
			username : 'Gaurav',
			password : 'Solanke',
			isUser : false,
			isHome : true,
			name : 'vatsalya',
			houseId : 'house_1'
		};
		
		cloudServerClient.on('connect', function() {
			connection_logger.info('cloudServerClient connected ');
			cloudServerClient.emit('authentication', authenticationObj);
		});
		
		cloudServerClient.on('authenticated', function(data) {
			connection_logger.info('cloudServerClient authenticated ', data);
			cloudServerClient.emit('registerIP', null);
		});
		
		cloudServerClient.on('houseIPUpdates', function(data) {
			connection_logger.debug('HouseIp : ', data);
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

			var lastTime = null;
			selfConnection.on('connect', function() {
				connection_logger.info('Self connection established in '+(new Date().getTime() - lastTime)/1000+"sec");
				selfConnection.emit('authentication', authenticationObj);
			});

			selfConnection.on('authenticated', function(data) {
				connection_logger.info('authenticated self server');
			});

			selfConnection.on('disconnect', function() {
				lastTime = new Date().getTime();
				connection_logger.error('Self connection disconnected');
				cloudServerClient.emit('registerIP', null);
			});
			
			selfConnection.on('reconnect_error', function(e) {
				connection_logger.error('Self connection reconnect_error');
			});
			

		})

		cloudServerClient.on('disconnect', function() {
			connection_logger.error('cloudServerClient disconnected');
		});

		cloudServerClient.on('error', function(e) {
			connection_logger.error('cloudServerClient error : ', e);
		});

		cloudServerClient.on('reconnect', function(number) {
			//connection_logger.info('cloudServerClient reconnect : ', number);
		});

		cloudServerClient.on('reconnect_attempt', function() {
			//connection_logger.info('cloudServerClient reconnect_attempt ');
		});

		cloudServerClient.on('reconnecting', function(number) {
			//connection_logger.info('cloudServerClient reconnecting');
		});

		cloudServerClient.on('reconnect_error', function(e) {
			connection_logger.error('cloudServerClient reconnect_error');
		});

		cloudServerClient.on('reconnect_failed', function() {
			//connection_logger.error('cloudServerClient reconnect_failed');
		});

		cloudServerClient.on('unauthorized',function(err) {
			connection_logger.error("There was an error with the authentication:",err.message);
		});

	}
}
