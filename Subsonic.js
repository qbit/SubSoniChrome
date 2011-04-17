var Subsonic = {
	serverStatus: false, 
	serverLoaded: false,
	serverVersion: '1.5.0',
	serverName: "SubSonicChrome",
	loadedUrl: '',
	hasMsg: false,

	reqs: {
		artists: "/rest/getIndexes.view"
	},

	colors: {
		green: "#32CD32",
		white: "#ffffff",
		red: "#FF4500"
	},

	loadServer: function( serverObj ) {

		if ( ! serverObj.password ) {
			log( "need password" );
			// prompt for password
		}

		var artists = serverObj.server 
			+ this.reqs['artists'] 
			+ "?u=" + serverObj.username  
			+ "&p=" + serverObj.password 
			+ "&v=" + this.serverVersion
			+ "&c=" + this.serverName
			+ "&f=json";

		$.ajax( {
			url: artists,
			success: function( data ) {
				// draw tree view here
			}
		});
	},

	listServers: function() {
		if ( localStorage.length === 0 ) {
			return [];
		} else {
			return JSON.parse( localStorage.servers );
		}
	},

	notify: function( msg, color ) {
		log( "Showing notification: '" + msg + "' with color of '" + Subsonic.colors[color] + "'" );
		$('#notification').slideDown( 'slow' );
		$('#notification').html( msg );
		$('#notification').css( "background-color", Subsonic.colors[color] ); 

		this.msgTimer = setTimeout( function() {
			$('#notification').slideUp( 'slow' );
			Subsonic.hasMsg = false;
		}, 5000 );
	},

	testServer: function( serverObj ) {

		var url = serverObj.server + "/rest/ping.view?u=" + serverObj.username + "&p=" + serverObj.password + "&c=" + Subsonic.serverName + "&f=json&v=" + Subsonic.serverVersion;

		// switch to jquery
		$.ajax({
			url: url,
			jsonp: true,
			success: function( data ) {
				if ( data['subsonic-response'].status === "ok" ) {
					Subsonic.serverStatus = true;
					Subsonic.notify( "Success!", 'green' );
				} else {
					Subsonic.notify( "Failed: " + data['subsonic-response'].error.message, 'red' );
				}
			},
			error: function( data ) {
				Subsonic.serverStatus = false;
				Subsonic.notify( "Failed: " + data, 'red' );
			}
		});
	},

	saveServer: function( serverObj ) {
		if ( ! localStorage.servers ) {
			localStorage.servers = [];
		}

		if ( serverObj.server && serverObj.username && serverObj.password) {

			Subsonic.testServer( serverObj );

			var servers = [];

			setInterval( function() {
				if ( Subsonic.serverStatus === true ) {

					if ( serverObj.save === true ) {
						delete serverObj.save;
						servers.push( serverObj );
					} else {
						delete serverObj.save;
						delete serverObj.password
						servers.push( serverObj );
					}

					localStorage['servers'] = JSON.stringify( servers );
					Subsonic.serverStatus = false;
				}
			}, 100 );

		}
	},

};
