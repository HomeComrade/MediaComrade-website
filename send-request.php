<?php

require_once 'inc.php';

$domain = (isset($_POST['domain']) ? (string)$_POST['domain'] : null);
$uri = (isset($_POST['uri']) ? (string)$_POST['uri'] : null);
$postData = (isset($_POST['data']) && is_array($_POST['data']) ? $_POST['data'] : array());

if (!$domain || !in_array($domain, $serverDomains) || !$uri) {
	returnResult(json_encode(array(
		'success' => false,
		'type' => null,
		'data' => null,
	)));
}

$curlConfig = array(
	CURLOPT_URL => $domain.$uri,
	CURLOPT_PORT => PORT,
	CURLOPT_POST => true,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_POSTFIELDS => $postData,
);
//print_r($curlConfig);die();
$ch = curl_init();
curl_setopt_array($ch, $curlConfig);

$result = curl_exec($ch);

curl_close($ch);

returnResult($result);

function returnResult($json) {
	echo $json;
	die();
}