module.exports = {
	initMoscaServer : function() {

		mosca = require('mosca');

		pubSubServer = new mosca.Server({
			port : config.moscaPort
		});

		pubSubServer.on("error", function(err) {
			mosca_logger.error(err);
		});

		pubSubServer.on('clientConnected', function(client) {
			mosca_logger.info('ESP Connected \t:= ' + client.id);
		});

		pubSubServer.on('subscribed', function(topic, client) {
			mosca_logger.trace(client.id + ' has subscribed to Topic \t:= ' + topic);
		});

		pubSubServer.on('unsubscribed', function(topic, client) {
			mosca_logger.trace(client.id + ' has unsubscribed to Topic \t:= ' + topic);
		});

		pubSubServer.on('clientDisconnecting', function(client) {
			mosca_logger.trace(client.id + ' is disconnecting ');
		});

		pubSubServer.on('clientDisconnected', function(client) {
			mosca_logger.info(client.id + ' got disconnected');
		});

		pubSubServer.on('published', function(packet, client) {
			// console.log("Mosca Server >>>>>>>>>>>>>>> Published , Topic : " +
			// packet.topic + ' payload :' + packet.payload);
			if (packet.topic.indexOf('Home') != -1 && packet.payload.toString().indexOf('hello world') == -1) 
			{
				mosca_logger.info('Sending data to websocket');
				var respObj = {
					isHouse : true,
					houseId : config.homeId,
					publish : true,
					topic : packet.topic.toString(),
					payload : packet.payload.toString(),
					mosca : true
				}
				try {
					io.sockets.emit('recieve', JSON.stringify(respObj));
					pusherChannel.trigger('client-status-update', respObj);
					//cloudServerClient.emit('recieve_fromHouse', JSON.stringify(respObj));

					gcmmessage.addData('key1', JSON.stringify(respObj));

					var regTokens = [ regId ];

					// Set up the sender with you API key
					gcmmessage.addNotification('title', 'Alert!!!');

					// Now the sender can be used to send messages
					sender.send(gcmmessage, {
						registrationTokens : regTokens
					}, function(err, response) {
						if (err)
							console.error(err);
						else
							console.log(response);
					});

				} catch (e) {
					mosca_logger.error(e);

				}
			}

		});

		pubSubServer.on('ready', pubSubServerUp);

		function pubSubServerUp() {
			mosca_logger.info(' Mosca Server Started ');
			pubSubServer.authenticate = authenticate;
			pubSubServer.authorizePublish = authorizePublish;
			pubSubServer.authorizeSubscribe = authorizeSubscribe;

		}

		var authenticate = function(client, username, password, callback) {
			callback(null, true);
		}

		var authorizePublish = function(client, topic, payload, callback) {
			callback(null, true);
		}

		var authorizeSubscribe = function(client, topic, callback) {
			callback(null, true);
		}

	}
}
