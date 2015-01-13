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
		
		<title>Media Comrade - Browse</title>
		
		<link rel="shortcut icon" href="/favicon.ico" />
		<link href="/css/style.css" rel="stylesheet" type="text/css">
		<link href="/css/jquery.mobile-1.4.5.css" rel="stylesheet" type="text/css">
		
		<script type="text/javascript" src="/js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="/js/jquery.mobile-1.4.5.min.js"></script>
		<script type="text/javascript" src="/js/jquery.cookie.js"></script>
		<script type="text/javascript" src="/js/browse.js"></script>
		<script type="text/javascript" src="/js/media-comrade.js"></script>
		
		<script type="text/javascript">
			$(window).load(function() {
				loadCurrentDirectory();
				
				offset = 10;
				duration = 250;
				
				$(window).scroll(function() {
					if ($(this).scrollTop() > offset) {
						$('#back-to-top').fadeIn(duration);
					}
					else {
						$('#back-to-top').fadeOut(duration);
					}
				});
				
				$('#back-to-top').click(function(event) {
					event.preventDefault();
					jQuery('html, body').animate({scrollTop: 0}, duration);
					return false;
				})
			});
		</script>
	</head>
	<body>
		<div data-role="page">
			<div id="header" data-role="header" data-position="fixed">
				<a href="/remote.php" data-icon="back" class="ui-btn-left">Back</a>
				<h1><?php echo htmlentities($serverInfo['serverDomain']) ?></h1>
				<div id="browse-dir"></div>
			</div>
			
			<div data-role="content">
				<div class="ui-field-contain">
					<input type="search" id="search">
				</div>
				
				<ul data-role="listview" data-filter="true" data-input="#search" id="sorted-list">
					
				</ul>
				
				<a href="#" id="back-to-top">Top</a>
			</div>
			
			<div data-role="footer" data-position="fixed">
				<div data-role="navbar">
					<ul>
						<li>
							<button class="command" id="play-button" command-id="play" disabled="disabled">Play</button>
						</li>
						<li>
							<button class="command" id="enqueue-button" command-id="enqueue" disabled="disabled">Enqueue</button>
						</li>
						<li>
							<button class="command" id="insert-at-button" command-id="currentPlaylistSelection" disabled="disabled">Insert At</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</body>
</html>
