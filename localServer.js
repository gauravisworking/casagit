module.exports = {
	initLocalServer : function () {
		
		var express = require('express');
		var app = express();
		var http = require('http');
		var osipaddress = "0.0.0.0";
		var osport = 8085;
		
		app.set('port', osport);
		app.set('ipaddress', osipaddress);
		
		app.get('/file.bin', function(req, res) {
			local_server_logger.info('Requested for file.bin ',req.query);
		  res.sendFile('/home/pi/workspace/casa/arduino/httpUpdate-eap.cpp.bin')
		})
		
		var server = http.createServer(app);
		io = require('socket.io').listen(server);
		
		//io.set('transports', ['websocket']);
		require('socketio-auth')(io, {
			authenticate : function (socket, data, callback) {
				var username = data.username;
				var password = data.password;
				if (username == password) {
					local_server_logger.error(" Authentication error in socketio-auth");
					return callback(new Error("User not  found"));
				} else {
					return callback(null, {games : 'test'});
				}
			},
			postAuthenticate : function (socket, data) {
				socket.houseId = data.houseId;
				local_server_logger.info('User joined room : ', data.username);
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
			if (socket.handshake.query.foo == "bar") {
				return next();
			}
			local_server_logger.error(" Authentication error in query");
			next(new Error('Authentication error'));
		});
		
		io.sockets.on('connection', function (socket) {
			
			socket.on('registrationID', function (data) {
				local_server_logger.debug("Device Registration : ", data.registrationId);
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
					local_server_logger.error('Error in parsing : ', data);
					
				}
				
				socket.broadcast.to(socket.houseId).emit('recieve', data);
				var ackObj = {
					ack : true,
					jobId : obj.jobId
				}
				callback(ackObj);
				local_server_logger.debug("Form house : " + socket.houseId, obj);
			});
			
		});
		
		server.listen(app.get('port'), app.get('ipaddress'), function () {
			local_server_logger.info('Express server started');
		});
		
	}
}
