module.exports = {
	initMoscaServer : function () {
		pubSubServer = new mosca.Server({
				port : config.moscaPort
			});
		
		pubSubServer.on("error", function (err) {
			console.log('Mosca Server >>>>>>>>>>>>>>> ',err);
		});
		
		pubSubServer.on('clientConnected', function (client) {
			console.log('Mosca Server >>>>>>>>>>>>>>> ESP Connected \t:= ', client.id);
		});
		
		pubSubServer.on('subscribed', function (topic, client) {
			//console.log("Mosca Server >>>>>>>>>>>>>>> Subscribed to Topic : " + topic);
		});
		
		pubSubServer.on('unsubscribed', function (topic, client) {
			console.log('Mosca Server >>>>>>>>>>>>>>> unsubscribed := ', topic);
		});
		
		pubSubServer.on('clientDisconnecting', function (client) {
			console.log('Mosca Server >>>>>>>>>>>>>>> clientDisconnecting := ', client.id);
		});
		
		pubSubServer.on('clientDisconnected', function (client) {
			console.log('Mosca Server >>>>>>>>>>>>>>> Client Disconnected := ', client.id);
		});
		
		pubSubServer.on('published', function (packet, client) {
			//console.log("Mosca Server >>>>>>>>>>>>>>> Published , Topic : " + packet.topic + ' payload :' + packet.payload);
			if (packet.topic.indexOf('Home') != -1 && packet.payload.toString().indexOf('hello world') == -1) {
				console.log("Mosca Server >>>>>>>>>>>>>>> Publishing to websocket ");
				var respObj = {
						isHouse : true,
						houseId: config.homeId,
						publish : true,
						topic : packet.topic.toString(),
						payload : packet.payload.toString(),
						mosca : true
					}
				try{	
					io.sockets.emit('recieve', JSON.stringify(respObj));
					
					gcmmessage.addData('key1', JSON.stringify(respObj));
				 
						var regTokens = [regId];
						 
						// Set up the sender with you API key 
						gcmmessage.addNotification('title', 'Alert!!!');
						 
						// Now the sender can be used to send messages 
						sender.send(gcmmessage, { registrationTokens: regTokens }, function (err, response) {
							if(err) console.error(err);
							else 	console.log(response);
						});
				
				}catch(e)
				{
					console.log("yet not connected to websocket ",e);

				}
				

				/*clients.forEach(function (client) {
					console.log("\n @ " + client.name);
					var respObj = {
						isDataFromHome : true,
						homeId : config.homeId,
						topic : packet.topic.toString(),
						payload : packet.payload.toString()
					}
					socket.emit('houseUpdates', JSON.stringify(respObj));
				});*/
			}
			
		});
		
		pubSubServer.on('ready', pubSubServerUp);
		
		function pubSubServerUp() {
			console.log('Mosca Server >>>>>>>>>>>>>>> Mosca pubSubServer is up and running.');
			pubSubServer.authenticate = authenticate;
			pubSubServer.authorizePublish = authorizePublish;
			pubSubServer.authorizeSubscribe = authorizeSubscribe;
			
		}
		
		var authenticate = function (client, username, password, callback) {
			//console.log('Mosca Server >>>>>>>>>>>>>>> authenticate : usename - ' + username + ', password - ' + password);
			callback(null, true);
		}
		
		var authorizePublish = function (client, topic, payload, callback) {
			callback(null, true);
		}
		
		var authorizeSubscribe = function (client, topic, callback) {
			callback(null, true);
		}
		
	}
}
