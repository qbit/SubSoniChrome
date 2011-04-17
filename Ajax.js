var Ajax = { 

	init: function ( service_url, mod_name ) { 
		this.service_url = service_url;
		this.module_name = mod_name;
		this.abortId;
		this.requestTimeout = 10000;
		this.failCount = 0;
	},  

	onError: function( oe, reason ) {
		++Ajax.failCount;
		Ajax.making_request = 0;
		window.clearTimeout( Ajax.abortId );
		if ( Ajax.debug ) {
			console.log( reason );
		}
		if ( oe ) {
			oe( reason );
		}
	},

	onSuccess: function( oc, returnVal ) {
		Ajax.failCount = 0;
		Ajax.making_request = 0;
		window.clearTimeout( Ajax.abortId );
		if ( oc ) {
			oc( returnVal );
		}
	},

	making_request: 0,
        
	make_request: function ( on_complete, on_error ) { 
		if ( Ajax.making_request != 0 ) {
			return;
		}
		try {
			Ajax.making_request = 1;
			var A = new XMLHttpRequest();

			this.abortId = window.setTimeout( function () {
				Ajax.onError( on_error, 'Timeout' );
				A.abort();
			}, this.requestTimeout );

			A.onerror = function( e ) {
				Ajax.onError;
			};

			A.onreadystatechange = function() {
				var mod = this.module_name;
				if (A.readyState === 4) {
					if (A.status === 200) {
						if ( A.responseXML ) {

							var json = A.responseXML;
							
							console.log( json );
							/*
							 * fun little session in getting multiple xpath stuff.
							 * it's too dificult to display multiple results 
							 * in a little tiny badge
							var s = [];
							var n = [];
							var r = [];
							for ( var i = 0; i < obj.length; i++ ) {
								s[i] = xml.evaluate( obj[i], xml, null, XPathResult.ANY_TYPE, null );
								if ( s[i] ) {
									n[i] = s[i].iterateNext();
									if ( n[i] && n[i].textContent ) {
										r.push( n[i].textContent );
									}
								} else {
									break;
								}
							}

							delete s;
							delete n;

							if ( r.length > 0 ) {
								Ajax.onSuccess( on_complete, r );
							} else {
								Ajax.onError( on_error, 'NotLoggedIn' );
							}
							*/

							if ( CountNode ) {
								Ajax.onSuccess( on_complete, CountNode.textContent );
							} else {
								Ajax.onError( on_error, 'NotLoggedIn' );
							}
						}
					} else { 
						Ajax.onError( on_error, A.status );
					}   
				} else { 
					return;
				}
			};

			A.open("POST", this.service_url, true);

			A.send();
		} catch( e ) {
			console.error( "Can't connect to : %s", this.service_url );
		}
	}
};
