var Subsonic = {
	serverStatus: false, 
	listServers: function() {
		return localStorage['servers'] || [];
	},

	testServer: function( serverObj ) {
		function success ( ret ) {
			Subsonic.serverStatus = true;
		}

		function fail( ret ) {
			Subsonic.serverStatus = false;
		}

		var url = serverObj.server + "/rest/ping.view?u=" + serverObj.username + "&p=" + serverObj.password + "&c=SubSoniChrome&f=json";

		Ajax.init( url, 'Subsonic' );
		Ajax.make_request( 
			success,
			fail
		);
	},

	saveServer: function( serverObj ) {
		if ( ! localStorage['servers'] ) {
			localStorage['servers'] = [];
		}

		if ( serverObj.server && serverObj.username && serverObj.password) {
			var results = Subsonic.testServer( serverObj );
			if ( results.success ) {
				if ( serverObj.save === true ) {
					localStorage['servers'].push( serverObj );
				} else {
					delete serverObj.password
					localStorage['servers'].push( serverObj );
				}
				return true;
			} else {
				return results;
			}
		}
	},

};
