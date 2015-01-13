var COMMANDS = {
	disconnect: {
		type: 'disconnect',
		uri: null,
	},
	heartbeat: {
		type: 'heartbeat',
		uri: '/heartbeat/',
	},
	playPause: {
		type: 'play-pause',
		uri: '/play-pause/',
	},
	next: {
		type: 'next',
		uri: '/next/',
	},
	previous: {
		type: 'previous',
		uri: '/previous/',
	},
	seekFwd: {
		type: 'seek-fwd',
		uri: '/seek-fwd/',
	},
	seekBwd: {
		type: 'seek-bwd',
		uri: '/seek-bwd/',
	},
	skipTitleSequence: {
		type: 'skip-title-sequence',
		uri: '/skip-title-sequence/',
	},
	volumeUp: {
		type: 'volume-up',
		uri: '/volume-up/',
	},
	volumeDown: {
		type: 'volume-down',
		uri: '/volume-down/',
	},
	volumeUpTV: {
		type: 'volume-up-tv',
		uri: '/volume-up-tv/',
	},
	volumeDownTV: {
		type: 'volume-down-tv',
		uri: '/volume-down-tv/',
	},
	muteTv: {
		type: 'mute-tv',
		uri: '/mute-tv/',
	},
	powerTv: {
		type: 'power-tv',
		uri: '/power-tv/',
	},
	sourceTv: {
		type: 'source-tv',
		uri: '/source-tv/',
	},
	fullscreen: {
		type: 'fullscreen',
		uri: '/fullscreen/',
	},
	randomSettings: {
		type: 'random-settings',
		uri: '/random-settings/',
	},
	random: {
		type: 'random',
		uri: '/random/',
	},
	browse: {
		type: 'browse',
		uri: '/browse/',
	},
	enqueue: {
		type: 'enqueue',
		uri: '/enqueue/',
	},
	play: {
		type: 'play',
		uri: '/play/',
	},
	playAt: {
		type: 'play-at',
		uri: '/play-at/',
	},
	insertAt: {
		type: 'insert-at',
		uri: '/insert-at/',
	},
	lastPlaylist: {
		type: 'last-playlist',
		uri: '/last-playlist/',
	},
	toggleControls: {
		type: 'toggle-controls',
		uri: '/toggle-controls/',
	},
	allShows: {
		type: 'all-shows',
		uri: '/all-shows/',
	},
	quit: {
		type: 'quit',
		uri: '/quit/',
	},
	currentPlaylist: {
		type: 'current-playlist',
		uri: '/current-playlist/',
	},
	currentPlaylistSelection: {
		type: 'current-playlist-selection',
		uri: '/current-playlist-selection/',
	},
};

var COOKIE_NAMES = {
	serverDomain: 'serverDomain',
	serverType: 'serverType',
	randomSelectedShows: 'randomSelectedShows',
	randomAllShows: 'randomAllShows',
	browseDir: 'browseDir',
	serverOptions: 'serverOptions',
};

var REQUEST_URL = '/send-request.php';
//var REQUEST_URL = '/json.php';

$(document).on('click', '.server', function() {
	domain = $.trim($(this).html());

	console.log('Connecting to: '+domain);
	
	postVars = {
		domain: domain,
		uri: COMMANDS.heartbeat.uri,
	};
	
	loadingView('show');
	
	$.post(REQUEST_URL, postVars, function(response) {
		response.domain = domain;
		
		handleSuccessfulResponse(response);
	})
	.fail(function() {
		console.log('Failed for: '+domain);
		
		alert('Could not connect to: '+domain);
	})
	.always(function() {
		loadingView('hide');
	});
});

$(document).on('click', '.command', function() {
	domain = requireServerDomain();
	
	commandid = $.trim($(this).attr('command-id'));
	
	if (!commandid || !COMMANDS[commandid]) {
		console.log('Invalid command: '+commandid);
		return;
	}
	
	command = COMMANDS[commandid];
	
	if (command == COMMANDS.disconnect) {
		window.location.href = '/index.php';
		return;
	}
	
	//close any popups we have
	//we can hide this first because if we "return", we will show an error popup and that one will hide all others and come to front
	$('.popup').popup('close');
	
	postVars = {
		domain: domain,
		uri: command.uri,
		data: {},
	};
	
	if (command.type == COMMANDS.random.type) {
		randomSelectedShows = false;
		
		if (typeof(_selectedRandomShows) != 'undefined' && _selectedRandomShows.length > 0) {
			randomSelectedShows = JSON.stringify(_selectedRandomShows);
		}
		else {
			randomSelectedShows = $.cookie(COOKIE_NAMES.randomSelectedShows);
			
			if (!randomSelectedShows) {
				randomSelectedShows = false;
			}
		}
		
		playMethod = $(this).attr('random-action');
		playlistSize = $('input[name=episode-count]:checked').val();
		
		postVars.data.playlistSize = playlistSize;
		postVars.data.allowedShows = randomSelectedShows;
		postVars.data.playMethod = playMethod;
	}
	else if (command.type == COMMANDS.browse.type) {
		dir = '';
		
		if ($.cookie(COOKIE_NAMES.browseDir)) {
			dir = $.cookie(COOKIE_NAMES.browseDir);
		}
		
		browseToDir = $(this).attr('browse-dir');
		
		if (browseToDir) {
			if ('..' == browseToDir) {
				dirPieces = dir.split('/');
				dirPieces.pop();
				
				dir = dirPieces.join('/');
				
				if (!dir) {
					dir = '/';
				}
			}
			else {
				dir = dir+'/'+$(this).attr('browse-dir');
			}
		}
		
		postVars.data.dir = dir;
	}
	else if (
		command.type == COMMANDS.play.type
		|| command.type == COMMANDS.enqueue.type
		|| command.type == COMMANDS.insertAt.type
	) {
		if (_selectedFiles.length == 0) {
			showErrorPopup('No files selected to play/enqueue/insert');
			return;
		}
		
		postVars.data.filePaths = JSON.stringify(_selectedFiles);
		
		if (command.type == COMMANDS.insertAt.type) {
			postVars.data.position = $('input[name=insert-position]:checked').val();
		}
	}
	else if (command.type == COMMANDS.playAt.type) {
		if ($('input[name=play-position]:checked').val()) {
			postVars.data.position = $('input[name=play-position]:checked').val();
		}
		else {
			showErrorPopup('No playlist position was selected');
			return;
		}
	}
	
	console.log('Sending command: '+domain+' type: '+command.type+' uri: '+command.uri+' postVars: ');
	console.log(postVars)
	
	loadingView('show');
	
	$.post(REQUEST_URL, postVars, function(response) {
		//console.log('response: '+response);
		
		handleSuccessfulResponse(response);
	})
	.fail(function() {
		showErrorPopup('Command failed: '+command);
	})
	.always(function() {
		loadingView('hide');
	});
});

function handleSuccessfulResponse(response) {
	try {
		response = jQuery.parseJSON(response);
	}
	catch (error) {
		showErrorPopup('Invalid response JSON');
		return;
	}
	
	if (!response.success) {
		showErrorPopup('Command failure');
		return;
	}
	
	switch (response.type) {
		case COMMANDS.heartbeat.type:
			$.cookie(COOKIE_NAMES.serverDomain, domain);
			$.cookie(COOKIE_NAMES.serverType, response.data.serverType);
			
			serverOptions = [];
			
			if (response.data.irRemote) {
				serverOptions.push('irRemote');
			}
			
			$.cookie(COOKIE_NAMES.serverOptions, JSON.stringify(serverOptions));
			
			//$.mobile.pageContainer.pagecontainer('change', '/remote.php');
			window.location.href = '/remote.php';
			break;
		case COMMANDS.randomSettings.type:
			$.cookie(COOKIE_NAMES.randomAllShows, JSON.stringify(response.data));
			
			//$.mobile.pageContainer.pagecontainer('change', '/random-settings.php');
			window.location.href = '/random-settings.php';
			break;
		case COMMANDS.browse.type:
			localStorage.setItem('dirList', JSON.stringify(response.data.dirList));
			
			$.cookie(COOKIE_NAMES.browseDir, response.data.dir.replace('//', '/'));//sometimes 2 slashes end up here...
			
			//$('body').pagecontainer('change', '/browse.php', {
			//	reloadPage: true,
			//});
			
			if ('/browse.php' != window.location.pathname) {
				window.location.href = '/browse.php';
			}
			
			loadCurrentDirectory();
			break;
		case COMMANDS.play.type:
		case COMMANDS.enqueue.type:
		case COMMANDS.insertAt.type:
			window.location.href = '/remote.php';
			break;
		case COMMANDS.random.type:
			_selectedRandomShows = [];//clear the selected random shows
			
			html = '';
			
			$.each(response.data, function(i, item) {
				html += item+'<br />';
			});
			
			toast(html);
			break;
		case COMMANDS.currentPlaylist.type:
			//if it already exists, destroy it
			if ($('#current-playlist-popup').length != 0) {
				$('#current-playlist-popup').remove();
			}
			
			html =  '<div class="popup" id="current-playlist-popup" data-role="popup" data-overlay-theme="b" data-position-to="window">';
			html += '	<a href="#" data-rel="back" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-left">Close</a>';
			html += '	<div data-role="header">';
			html += '		<h1>Select File</h1>';
			html += '	</div>';
			html += '	<div data-role="content">';
			html += '		<div data-role="fieldcontain">';
			
			$.each(response.data, function(i, item) {
				html += '		<input type="radio" name="play-position" id="play-position-'+i+'" value="'+i+'" />';
				html += '		<label for="play-position-'+i+'">'+(i + 1)+') '+item+'</label>';
			});
			
			html += '			<button class="command" command-id="playAt">Play</button>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
			
			$.mobile.activePage.append(html).trigger('create');
			
			$('#current-playlist-popup').popup();
			$('#current-playlist-popup').popup('open');
			break;
		case COMMANDS.allShows.type:
			//if it already exists, destroy it
			if ($('#all-shows-popup').length != 0) {
				$('#all-shows-popup').remove();
			}
			
			html =  '<div class="popup" id="all-shows-popup" data-role="popup" data-overlay-theme="b" data-position-to="window">';
			html += '	<a href="#" data-rel="back" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-left">Close</a>';
			html += '	<div data-role="header">';
			html += '		<h1>Select Shows</h1>';
			html += '	</div>';
			html += '	<div data-role="content">';
			html += '		<div data-role="fieldcontain">';
			
			$.each(response.data, function(i, item) {
				html += '		<input type="checkbox" class="show-checkbox" id="show-'+i+'" value="'+item+'" />';
				html += '		<label for="show-'+i+'">'+item+'</label>';
			});
			
			html += '			<a href="#" data-role="button" data-rel="back">Finish</a>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
			
			$.mobile.activePage.append(html).trigger('create');
			
			$('#all-shows-popup').popup({
				afterclose: function(event, ui) {
					$('#random-popup').popup('open');
				}
			});
			$('#all-shows-popup').popup('open');
			break;
		case COMMANDS.currentPlaylistSelection.type:
			//if it already exists, destroy it
			if ($('#insert-at-popup').length != 0) {
				$('#insert-at-popup').remove();
			}
			
			html =  '<div class="popup" id="insert-at-popup" data-role="popup" data-overlay-theme="b" data-position-to="window">';
			html += '	<a href="#" data-rel="back" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-left">Close</a>';
			html += '	<div data-role="header">';
			html += '		<h1>Insert at Position</h1>';
			html += '	</div>';
			html += '	<div data-role="content">';
			html += '		<div data-role="fieldcontain">';
			html += '		<input type="radio" name="insert-position" id="insert-position-0" value="0" />';
			html += '		<label for="insert-position-0">--Start--</label>';
			
			$.each(response.data, function(i, item) {
				i++;
				
				html += '		<input type="radio" name="insert-position" id="insert-position-'+i+'" value="'+i+'" />';
				html += '		<label for="insert-position-'+i+'">'+item+'</label>';
			});
			
			html += '			<button class="command" command-id="insertAt">Finish</a>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
			
			$.mobile.activePage.append(html).trigger('create');
			
			$('#insert-at-popup').popup();
			$('#insert-at-popup').popup('open');
			break;
	}
}

function showErrorPopup(text) {
	//if it already exists, destroy it
	if ($('#error-popup').length != 0) {
		$('#error-popup').remove();
	}
	
	html =  '<div class="popup" id="error-popup" data-role="popup" data-overlay-theme="b" data-position-to="window">';
	html += '	<a href="#" data-rel="back" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-left">Close</a>';
	html += '	<div data-role="header">';
	html += '		<h1>Error</h1>';
	html += '	</div>';
	html += '	<div data-role="content">';
	html += '		<div class="error-message">';
	html += '			'+text;
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	
	$.mobile.activePage.append(html).trigger('create');
	
	$('#error-popup').popup({
		overlayTheme: 'b',
		positionTo: 'window',
	});
	$('#error-popup').popup('open');
}

function loadingView(method) {
	if (typeof(method) == 'undefined') {
		return;
	}
	
	switch (method) {
		case 'show':
			$.mobile.loading('show', {
				text: 'Loading...',
				textVisible: true,
			});
	
			$('body').append('<div class="ui-loader-background"></div>');
			break;
		case 'hide':
			$('.ui-loader-background').remove();
			
			$.mobile.loading('hide');
			break;
	}
}

function toast(text) {
	if (0 == $('#toast').length) {
		html = '<div id="toast"></div>';
		$('body').append(html);
	}
	
	$('#toast').html(text).fadeIn(400).delay(2000).fadeOut(400);
}

function getCommandUrl(domain, command) {
	return {
		domain: domain,
		uri: command.uri,
	};
	//'/send-request.php?domain='+domain+'&port='+PORT+'&uri='+command.uri;
	//return 'http://'+domain+':'+PORT+command.uri;
}

function requireServerDomain() {
	serverDomain = $.cookie(COOKIE_NAMES.serverDomain);
	
	if (!serverDomain) {
		console.log('Missing server domain!');
		window.location.href = '/index.php';
		return;
	}
	
	return serverDomain;
}
