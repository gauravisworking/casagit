module.exports = {
		startPusherClient : function() {
			
			var request = require('request');

			request.post(
			    'http://websocket-hometesting.rhcloud.com/login/user',
			    { id: 1234 },
			    function (error, response, body) {
			        if (!error && response.statusCode == 200) {
			            console.log("request success : ",body);
			            var token = JSON.parse(body).token;
			            Pusher = require('pusher-client');
						
						var pusher = new Pusher('ffcfc6d9c8db6b2e9be2', {
							authTransport : 'jsonp',
							  auth: {
								params: {
								  token: token
								}
							  },
							  
						    authEndpoint: 'http://websocket-hometesting.rhcloud.com/pusher/auth'
						});
					    
					    pusherChannel = pusher.subscribe('private-home-10001');
						
					    
					    
					    pusherChannel.bind('pusher:subscription_error', function (status) {
					    	console.error("error subscribing ", status)
					    	if (status == 408 || status == 503) {
					    	}
					    });
						
					    pusherChannel.bind('pusher:subscription_succeeded', function (status) {
					    	console.log("Connected ...  ");
					    	
					    	pusherChannel.bind('client-get-status-update', function (data) {
					    		
					    		var newPacket = {
					    				topic : 'espGroup',
					    				payload : 'STAT',
					    				retain : false,
					    				qos : 0
					    			};
					    		pubSubServer.publish(newPacket, function () {});
					    		console.log("Getting status update...");
						    });
					    	
					    	
					    });
						
					    
			        }
			    }
			);
			
			
			
		}
}
