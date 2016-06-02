module.exports = {
	initLocalServer : function () {
		
		var express = require('express');
		var app = express();
		var http = require('http');
		var osipaddress = "192.168.0.124";
		var osport = 8085;
		
		app.set('port', osport);
		app.set('ipaddress', osipaddress);
		
		var server = http.createServer(app);
		io = require('socket.io').listen(server);
		
		//io.set('transports', ['websocket']);
		require('socketio-auth')(io, {
			authenticate : function (socket, data, callback) {
				console.log('authenticate in progress');
				var username = data.username;
				var password = data.password;
				console.log('Authenticated....');
				if (username == password) {
					return callback(new Error("User not  found"));
				} else {
					return callback(null, true);
				}
			},
			postAuthenticate : function (socket, data) {
				socket.houseId = data.houseId;
				console.log('User joined room : ', data);
				socket.join(socket.houseId);
				socket.broadcast.to(socket.houseId).emit('newUserJoined', data.name);
				var newPacket = {
					topic : 'espGroup',
					payload : 'STAT',
					retain : false,
					qos : 0
				};
				pubSubServer.publish(newPacket, function () {});
			},
			timeout : 20000
		});
		
		io.use(function (socket, next) {
			console.log("Query: ", socket.handshake.query);
			if (socket.handshake.query.foo == "bar") {
				return next();
			}
			// call next() with an Error if you need to reject the connection.
			next(new Error('Authentication error'));
		});
		
		io.sockets.on('connection', function (socket) {
			
			socket.on('registrationID', function (data) {
				console.log("Device Registration : ", data.registrationId);
				regId = data.registrationId;
				gcmmessage.addData('key1', 'msg1');
				var regTokens = [regId];
			});
			
			socket.on('houseUpdates', function (data, callback) {
				var obj = JSON.parse(data);
				if (obj.mosca) {
					return;
				}
				try {
					var request = obj;
					
					if (request.performAction) {
						var newPacket = {
							topic : request.topic,
							payload : request.action,
							retain : false,
							qos : 0
						};
						pubSubServer.publish(newPacket, function () {});
					}
				} catch (e) {
					console.log('Error in parsing : ', data);
					
				}
				
				socket.broadcast.to(socket.houseId).emit('recieve', data);
				var ackObj = {
					ack : true,
					jobId : obj.jobId
				}
				callback(ackObj);
				console.log("Form house : " + socket.houseId, obj);
			});
			
		});
		
		server.listen(app.get('port'), app.get('ipaddress'), function () {
			console.log('Express server listening on port ' + app.get('port'));
		});
		
	}
}
