var Subsonic = {
	serverStatus: false, 
	serverVersion: '1.5.0',

	gets: function( type ) {
	},

	listServers: function() {
		return localStorage['servers'] || [];
	},

	testServer: function( serverObj ) {
		function success ( ret ) {
			Subsonic.serverStatus = true;
			console.log( "Success!" + ret );
		}

		function fail( ret ) {
			Subsonic.serverStatus = false;
			console.log( "Failed!" + ret );
		}

		var url = serverObj.server + "/rest/ping.view?u=" + serverObj.username + "&p=" + serverObj.password + "&c=SubSoniChrome&f=json&v=" + Subsonic.serverVersion;
		console.log( "Testing: " + url );

		Ajax.init( url, 'Subsonic' );
		Ajax.make_request( 
			success,
			fail
		);
	},

	saveServer: function( serverObj ) {
		console.log( "Saving..." );
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
