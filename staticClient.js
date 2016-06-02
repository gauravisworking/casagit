module.exports = {
	connectToServer : function () {
		
		staticMaster = new net.Socket() ;
		
		staticMaster.connect(config.staticMasterPort, config.staticMasterIp, function () {
			
			var obj = {
				homeId : config.homeId,
				isThisHome : true,
				isThisUser : false,
				name : 'raspberryPi',
				registerMe : true,
				performAction : false,
				topic : "",
				action : ""
			};
			staticMaster.write(JSON.stringify(obj));
			console.log('Static Client >>>>>>>>>>>>>>> Connected to Static Server');
		});
		
		staticMaster.on('data', function (data) {
			console.log('Static Client >>>>>>>>>>>>>>> Data Received from Static Server : ' + data);
			
			data = data.toString();
			data = replaceall('\n', '', data);
			data = replaceall('\r', '', data)
			var request = JSON.parse(data.trim());
			
			if(request.isThisMassage)
			{
				console.log('Static Client >>>>>>>>>>>>>>> Massage to Me : '+ request.massage);
			}
			
			if (request.isThisUser) 
				{
					if(request.registerMe){
						
					}
					if(request.performAction){
						console.log('Static Client >>>>>>>>>>>>>>> data :' + data);
							var newPacket = {
								topic : request.topic,
								payload : request.action,
								retain : false,
								qos : 0
							};
							pubSubServer.publish(newPacket, function () {});
						}
				}
		});
		
		staticMaster.on('close', function () {
			console.log('Static Client >>>>>>>>>>>>>>> Connection closed with static server');
		});
		
		staticMaster.on('error', function (err) {
			console.error('Static Client >>>>>>>>>>>>>>> Error : ',err);
		});
	}
}
