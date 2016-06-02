module.exports = {
	initStaticServer : function () {
		var staticClients = [];
		var homes = [];
		this.staticServer = net.createServer(function (socket) {
				try {
					socket.name = socket.remoteAddress + ":" + socket.remotePort;
					socket.setNoDelay(true);
					socket.setKeepAlive(true, 5000);
					staticClients.push(socket);
					var response = {
						isThisMassage : true,
						massage : "Static Server >>>>>>>>>>>>>>> Welcome " + socket.name + "\n"
					}
					socket.write(JSON.stringify(response));
					console.log('Static Server >>>>>>>>>>>>>>> New connection @' + socket.name);
					
					socket.on('data', function (data) {
						data = data.toString();
						data = replaceall('\n', '', data);
						data = replaceall('\r', '', data)
						var request = JSON.parse(data.trim());
						console.log('Static Server >>>>>>>>>>>>>>> Json :',request);
						if (request.isThisHome) {
							if(request.registerMe)
							{
								socket.homeId = request.homeId;
								socket.secondName = request.name;
								socket.isConnected = true;
								homes.push(socket);
								console.log('Static Server >>>>>>>>>>>>>>> new home online :' + data);
							}
						}
						if (request.isThisUser) 
						{
							if(request.registerMe){
								
							}
							if(request.performAction){
								homes.forEach(function (home) {
									if (home.homeId == request.homeId && home.isConnected) {
										console.log('Static Server >>>>>>>>>>>>>>> frwding data to '+request.homeId +', data :' + data);
										home.write(data);
									} else {
										console.log('Static Server >>>>>>>>>>>>>>> '+ request.homeId +' is not online...');
									}
								});
								
								var resp = {
									jobId : request.jobId,
									massage : 'ACK'
								}
								socket.write(JSON.stringify(resp)+'\r\n');
							}
							
						}
					});
					
					socket.on('end', function () {
						console.log('Static Server >>>>>>>>>>>>>>> Client stoped...');
						staticClients.splice(staticClients.indexOf(socket), 1);
					});
					
					socket.on('error', function () {
						socket.end();
						socket.isConnected = false;
						staticClients.splice(staticClients.indexOf(socket), 1);
						console.log('Static Server >>>>>>>>>>>>>>> Unexpected client disconnection, client name : ' + socket.name);
					});
					
				} catch (e) {
					console.log("Static Server >>>>>>>>>>>>>>> Error in some client on static server " + e.message);
				}
			});
		
	},
	listen : function (staticPort) {
		this.staticServer.listen(staticPort);
		console.log("Static Server >>>>>>>>>>>>>>> Static Server Started on port : " + staticPort);
	}
}
