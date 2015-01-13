<?php

$rawData = (!empty($_COOKIE['randomAllShows']) ? json_decode($_COOKIE['randomAllShows']) : array());
$rawSelectedShows = (!empty($_COOKIE['randomSelectedShows']) ? (array)json_decode($_COOKIE['randomSelectedShows']) : array());
$data = array();
$key = 0;

foreach ($rawData as $category => $shows) {
	if (is_string($category) && is_array($shows)) {
		foreach ($shows as $show) {
			if (is_string($show))
			{
				if (!isset($data[$category])) {
					$data[$category] = array();
				}
				
				$data[$category][] = array(
					'title' => $show,
					'selected' => in_array($show, $rawSelectedShows),
					'key' => ++$key,
				);
			}
		}
	}
}

//first sort by type
ksort($data);

//now sort each show list array individually
foreach ($data as &$shows) {
	usort($shows, function($a, $b) {
		return strcasecmp($a['title'], $b['title']);
	});
}

/*
echo '<pre>';
print_r($data);
echo '</pre>';
die();
*/
?>
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html">
		<meta charset="utf-8">
		<meta http-equiv="Content-Language" content="en">
		
		<title>Media Comrade - Remote</title>
		
		<link rel="shortcut icon" href="/favicon.ico" />
		<link href="/css/style.css" rel="stylesheet" type="text/css">
		<link href="/css/jquery.mobile-1.4.5.css" rel="stylesheet" type="text/css">
		<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>
		
		<script type="text/javascript" src="/js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="/js/jquery.mobile-1.4.5.min.js"></script>
		<script type="text/javascript" src="/js/jquery.cookie.js"></script>
		<script type="text/javascript" src="/js/media-comrade.js"></script>
		<script type="text/javascript" src="/js/random.js"></script>
		
		<script type="text/javascript">
			$(window).load(function() {
				domain = requireServerDomain();
				
				$('#server-name').html(domain);
			});
		</script>
	</head>
	<body>
		<div data-role="header" data-position="fixed">
			<a href="/remote.php" data-icon="back" class="ui-btn-left">Back</a>
			<h1 id="server-name"></h1>
		</div>
		
		<div data-role="content">
			<?php if ($data): ?>
			<div data-role="fieldcontain">
				<div data-role="collapsible-set">
					<?php foreach ($data as $category => $showsList): ?>
					<div data-role="collapsible">
						<h3><?php echo $category ?></h3>
						<?php foreach ($showsList as $show): ?>
						<div data-role="fieldcontain">
						 	<fieldset data-role="controlgroup">
						 		<input type="checkbox" class="random-show-checkbox" id="show-<?php echo $show['key'] ?>" value="<?php echo htmlentities($show['title']) ?>" <?php if ($show['selected']): ?>checked="checked"<?php endif ?> />
								<label for="show-<?php echo $show['key'] ?>"><?php echo htmlentities($show['title']) ?></label>
							</fieldset>
						</div>
						<?php endforeach ?>
					</div>
					<?php endforeach ?>
				</div>
			</div>
			<?php else: ?>
			It appears there is no information set for the random settings yet
			<?php endif ?>
		</div>
	</body>
</html>
