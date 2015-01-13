<?php

define('BASE_HREF', 'http://media.apt/');
define('PORT', 8053);

$serverDomains = array(
	'media.apt',
	'andrew.apt',
	//'anella.apt',
	'shiznatix-toshiba.apt',
);

$serverTypes = array(
	'totem',
	'omxplayer',
);

//turn all options off by default
$serverOptions = array(
	'irRemote' => false,
);

//turn on the set options
if (isset($_COOKIE['serverOptions'])) {
	$setServerOptions = json_decode($_COOKIE['serverOptions']);
	
	if (is_array($setServerOptions)) {
		foreach ($setServerOptions as $setOption) {
			if (array_key_exists($setOption, $serverOptions)) {
				$serverOptions[$setOption] = true;
			}
		}
	}
}

function getRequiredServerInfo() {
	global $serverDomains;
	global $serverTypes;
	
	if (!isset($_COOKIE['serverDomain']) || !in_array($_COOKIE['serverDomain'], $serverDomains)) {
		header('Location: '.BASE_HREF);
		die();
	}
	
	if (!isset($_COOKIE['serverType']) || !in_array($_COOKIE['serverType'], $serverTypes)) {
		header('Location: '.BASE_HREF);
		die();
	}
	
	return array(
		'serverDomain' => $_COOKIE['serverDomain'],
		'serverType' => $_COOKIE['serverType'],
	);
}

function serverHasOption($option) {
	global $serverOptions;
	
	return in_array($option, $serverOptions);
}

function dump($arr) {
	echo '<pre>';
	print_r($arr);
	echo '</pre>';
}
