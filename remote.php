<?php

require_once 'inc.php';

$serverInfo = getRequiredServerInfo();

?>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html">
		<meta charset="utf-8">
		<meta http-equiv="Content-Language" content="en">
		<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>
		
		<title>Media Comrade - Remote</title>
		
		<link rel="shortcut icon" href="/favicon.ico" />
		<link href="/css/style.css" rel="stylesheet" type="text/css">
		<link href="/css/jquery.mobile-1.4.5.css" rel="stylesheet" type="text/css">
		
		<script type="text/javascript" src="/js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="/js/jquery.mobile-1.4.5.min.js"></script>
		<script type="text/javascript" src="/js/jquery.cookie.js"></script>
		<script type="text/javascript" src="/js/remote.js"></script>
		<script type="text/javascript" src="/js/media-comrade.js"></script>
		
		<script type="text/javascript">
			$(window).load(function() {
				
			});
		</script>
	</head>
	<body>
		<div data-role="header" data-position="fixed">
			<a href="/index.php" data-icon="back" class="ui-btn-left">Disconnect</a>
			<h1><?php echo htmlentities($serverInfo['serverDomain']) ?></h1>
			<a href="#menu-popup" data-rel="popup" data-icon="bars" class="ui-btn-right">Menu</a>
		</div>
		
		<div data-role="content">
			<div data-role="fieldcontain">
				<fieldset class="ui-grid-a">
					<div class="ui-block-a">
						<button class="command" data-icon="arrow-l" command-id="previous">Previous</button>
					</div>
					
					<div class="ui-block-b">
						<button class="command" data-icon="arrow-r" data-iconpos="right" command-id="next">Next</button>
					</div>
				</fieldset>
				
				<fieldset class="ui-grid-a">
					<div class="ui-block-a">
						<button class="command" command-id="playPause">Play / Pause</button>
					</div>
					
					<div class="ui-block-b">
						<button class="command" command-id="currentPlaylist">Current List</button>
					</div>
				</fieldset>
				
				<fieldset class="ui-grid-a">
					<div class="ui-block-a">
						<button class="command" data-icon="arrow-l" command-id="seekBwd">Back</button>
					</div>
					
					<div class="ui-block-b">
						<button class="command" data-icon="arrow-r" data-iconpos="right" command-id="seekFwd">Fwd</button>
					</div>
				</fieldset>
				
				<?php if ('totem' == $serverInfo['serverType']): ?>
				<button class="command" command-id="skipTitleSequence">Skip Title Sequence</button>
				<?php endif ?>
				
				<a href="#random-popup" data-rel="popup" data-role="button">Random</a>
				
				<fieldset class="ui-grid-a">
					<div class="ui-block-a">
						<button class="command" data-icon="arrow-d" command-id="volumeDown">Vol &#9660;</button>
					</div>
					
					<div class="ui-block-b">
						<button class="command" data-icon="arrow-u" data-iconpos="right" command-id="volumeUp">Vol &#9650;</button>
					</div>
				</fieldset>
				
				<?php if (serverHasOption('irRemote')): ?>
				<fieldset class="ui-grid-a">
					<div class="ui-block-a">
						<button class="command" data-icon="arrow-d" command-id="volumeDownTV">TV Vol &#9660;</button>
					</div>
					
					<div class="ui-block-b">
						<button class="command" data-icon="arrow-u" data-iconpos="right" command-id="volumeUpTV">TV Vol &#9650;</button>
					</div>
				</fieldset>
				
				<button class="full-button command" command-id="muteTv">TV Mute</button>
				<?php endif ?>
				
				<?php if ('totem' == $serverInfo['serverType']): ?>
				<button class="command" command-id="fullscreen">Full Screen</button>
				<?php endif ?>
				
				<button class="full-button command" command-id="browse">Browse</button>
				
				<?php if (serverHasOption('irRemote')): ?>
				<button class="command" command-id="sourceTv">TV Source</button>
				<?php endif ?>
			</div>
		</div>
		
		<!-- popups -->
		<div class="popup" id="menu-popup" data-role="popup" data-overlay-theme="b" data-tolerance="40,5,0,0">
			<ul data-role="listview" data-inset="true">
				<li>
					<a href="/index.php" class="command" command-id="disconnect">Disconnect</a>
				</li>
				<li>
					<a href="#" class="command" command-id="randomSettings">Random Settings</a>
				</li>
				<?php if ('totem' == $serverInfo['serverType']): ?>
				<li>
					<a href="#" class="command" command-id="toggleControls">Show Controls</a>
				</li>
				<li>
					<a href="#" class="command" command-id="lastPlaylist">Last Playlist</a>
				</li>
				<?php endif ?>
				<?php if ('omxplayer' == $serverInfo['serverType']): ?>
				<li>
					<a href="#" class="command" command-id="quit">Quit</a>
				</li>
				<?php endif ?>
				<?php if (serverHasOption('irRemote')): ?>
				<li>
					<a href="#" class="command" command-id="powerTv">TV Power</a>
				</li>
				<?php endif ?>
			</ul>
		</div>
		
		<div class="popup" id="random-popup" data-role="popup" data-overlay-theme="b" data-position-to="window">
			<a href="#" data-rel="back" data-role="button" data-icon="delete" data-iconpos="notext" class="ui-btn-left">Close</a>
			<div data-role="header">
				<h1>Random</h1>
				<a href="#" class="command ui-btn-right" command-id="allShows" data-rel="popup" data-icon="gear">Shows</a>
			</div>
			
			<div data-role="content">
				<div data-role="fieldcontain">
					<input type="radio" name="episode-count" id="episode-count-1" value="1" />
					<label for="episode-count-1">1</label>
				
					<input type="radio" name="episode-count" id="episode-count-2" value="2" />
					<label for="episode-count-2">2</label>
				
					<input type="radio" name="episode-count" id="episode-count-5" value="5" checked="checked" />
					<label for="episode-count-5">5</label>
				
					<input type="radio" name="episode-count" id="episode-count-10" value="10" />
					<label for="episode-count-10">10</label>
				
					<fieldset class="ui-grid-a">
						<div class="ui-block-a">
							<button class="command" command-id="random" random-action="play">Play</button>
						</div>
					
						<div class="ui-block-b">
							<button class="command" command-id="random" random-action="enqueue">Enqueue</button>
						</div>
					</fieldset>
				</div>
			</div>
		</div>
	</body>
</html>
