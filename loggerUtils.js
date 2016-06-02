module.exports = {
	startLogging : function () {
		
		log4js = require('log4js');
		log4js.loadAppender('file');
		log4js.addAppender(log4js.appenders.file('logs/mosca.log'), 'mosca');
		log4js.addAppender(log4js.appenders.file('logs/local_server.log'), 'local_server');
		log4js.addAppender(log4js.appenders.file('logs/connection.log'), 'connection');

		mosca_logger = log4js.getLogger('mosca');
		local_server_logger = log4js.getLogger('local_server');
		connection_logger = log4js.getLogger('connection');
		
		mosca_logger.setLevel('TRACE');
		local_server_logger.setLevel('TRACE');
		connection_logger.setLevel('TRACE');
		
		/*
		logger.trace('Entering cheese testing');
		logger.debug('Got cheese.');
		logger.info('Cheese is Gouda.');
		logger.warn('Cheese is quite smelly.');
		logger.error('Cheese is too ripe!');
		logger.fatal('Cheese was breeding ground for listeria.');
		 */
		

	}
}
