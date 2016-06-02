require.cache = {};

mosca 			= require('mosca');
net 			= require('net');
replaceall		= require("replaceall");
//Agenda		    = require("agenda");

config = {
	staticMasterIp : '123.201.194.202',
	staticMasterPort : 5001,
	localServerPort : 5000,
	moscaPort : 1883,
	homeId : 'house_1',
	projectDbUrl : "mongodb://localhost:27017/myproject",
	agendaDbUrl : "mongodb://localhost:27017/agenda",
};

clients = [];
pubSubServer = null;
mongoClient = null;
agenda = null;

ws = null;
io = null;
var localServer = null;
var staticServer = null;
var mongoUtils = null;
var agendaUtils = null;
var moscaServer = null;
var staticClient = null;
var ipUpdater = null;
var housePublicIP = null;
var webSocketObj = null;
var selfConnection = null;
ioClient = null;
				

var replace = require("replace"); 

replace({ 
regex: "Rookies", 
replacement: "martin", 
paths: ['/etc/wpa_supplicant/wpa_supplicant.conf'], 
recursive: true, 
silent: true, });



gcm = require('node-gcm');

gcmmessage = new gcm.Message({collapseKey: 'demo',
	priority: 'high',
	notification: {
		title: "Hello, World",
		body: "This is a notification that will be displayed ASAP."
	}});

sender = new gcm.Sender('AIzaSyDhuARb24CYJDknqdX8owCwz6pDyhxvh0c');
regId = null;
/*
// -------------------------------------------------------- Mongo DB ---------------------------------------------
mongoUtils = require('./mongoUtils');
mongoUtils.createClient();
mongoUtils.connect(config.projectDbUrl);
// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------- Mosca Server ---------------------------------------------
agendaUtils = require('./agendaUtils');
agendaUtils.init(config.agendaDbUrl);
agendaUtils.execute();
// -------------------------------------------------------------------------------------------------------------------
*/




// --------------------------------------------------- Websocket Client  -------------------------------------------------
//webSocketObj = require('./websocket');
//webSocketObj.initWebSocketServer();

ipUpdater = require('./iputils');
ipUpdater.startIPUpdater();


// -------------------------------------------------------- Local Websocket Server ---------------------------------------------
localServer = require('./localServer');
localServer.initLocalServer();
// -------------------------------------------------------------------------------------------------------------------




// -------------------------------------------------------- Mosca Server ---------------------------------------------
moscaServer = require('./moscaServer');
moscaServer.initMoscaServer();
// -------------------------------------------------------------------------------------------------------------------

