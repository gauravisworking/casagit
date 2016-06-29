require.cache = {};

net = require('net');
replaceall = require("replaceall");
Pusher = null;
pusherChannel = null;
//var Agenda = require("agenda");
clients = [];
mosca = null;
pubSubServer = null;
mongoClient = null;
agenda = null;

ws = null;
io = null;
staticServer = null;
cloudServerClient = null;

staticClient = null;
ipUpdater = null;
housePublicIP = null;
webSocketObj = null;
selfConnection = null;
gcmmessage = null;
config = {
	staticMasterIp : '123.201.194.202',
	staticMasterPort : 5001,
	localServerPort : 5000,
	moscaPort : 1883,
	homeId : 'house_1',
	projectDbUrl : "mongodb://localhost:27017/myproject",
	agendaDbUrl : "mongodb://localhost:27017/agenda",
};

/*
 * var replace = require("replace");
 * 
 * replace({ regex: "Rookies", replacement: "martin", paths:
 * ['/etc/wpa_supplicant/wpa_supplicant.conf'], recursive: true, silent: true,
 * });
 * 
 */



var loggerUtils = require('./loggerUtils');
loggerUtils.startLogging();

var gcmUtils = require('./gcmUtils');
gcmUtils.startGCM();

var cloudUtils = require('./cloudUtils');
cloudUtils.startCloudConnections();

var pusherClient = require('./pusherClient');
pusherClient.startPusherClient();


var localServerUtils = require('./localServer');
localServerUtils.initLocalServer();

var moscaServerUtils = require('./moscaServer');
moscaServerUtils.initMoscaServer();
/*
 
var iwlist = require('wireless-tools/iwlist');
 
iwlist.scan('wlan0', function(err, networks) {
  console.log(networks);
});
 
*/


/*
 * // -------------------------------------------------------- Mongo DB
 * --------------------------------------------- mongoUtils =
 * require('./mongoUtils'); mongoUtils.createClient();
 * mongoUtils.connect(config.projectDbUrl); //
 * -------------------------------------------------------------------------------------------------------------------
 *  // -------------------------------------------------------- Mosca Server
 * --------------------------------------------- agendaUtils =
 * require('./agendaUtils'); agendaUtils.init(config.agendaDbUrl);
 * agendaUtils.execute(); //
 * -------------------------------------------------------------------------------------------------------------------
 */

// --------------------------------------------------- Websocket Client
// -------------------------------------------------
// webSocketObj = require('./websocket');
// webSocketObj.initWebSocketServer();


// -------------------------------------------------------- Local Websocket
// Server ---------------------------------------------

// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------- Mosca Server
// ---------------------------------------------

// -------------------------------------------------------------------------------------------------------------------

