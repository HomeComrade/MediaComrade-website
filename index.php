<?php

require_once 'inc.php';

//unset any saved server options
setcookie('serverOptions', '', time() - 3600);

?>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html">
		<meta charset="utf-8">
		<meta http-equiv="Content-Language" content="en">
		<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>
		
		<title>Media Comrade - Connect</title>
		
		<link rel="shortcut icon" href="/favicon.ico" />
		<link href="/css/style.css" rel="stylesheet" type="text/css">
		<link href="/css/jquery.mobile-1.4.5.css" rel="stylesheet" type="text/css">
		
		<script type="text/javascript" src="/js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="/js/jquery.mobile-1.4.5.min.js"></script>
		<script type="text/javascript" src="/js/jquery.cookie.js"></script>
		<script type="text/javascript" src="/js/media-comrade.js"></script>
		
		<script type="text/javascript">
			$(window).load(function() {
				
			});
		</script>
	</head>
	<body>
		<div data-role="header" data-position="fixed">
			<h1>Select server:</h1>
		</div>
	
		<div data-role="content">
			<?php foreach ($serverDomains as $server): ?>
			<button class="server"><?php echo $server ?></button>
			<?php endforeach ?>
		</div>
	</body>
</html>
