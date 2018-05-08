<?php
$response = array();

$send_to = $_POST['send_to'];
$from = (!empty($_POST['from'])) ? $_POST['from'] : 'site.com <info@site.com>';

$subject = (!empty($_POST['subject'])) ? $_POST['subject'] : $from;

$body = '<strong>Имя:</strong> '.$_POST['name'].'<br />';
$body .= '<strong>E-mail:</strong> '.$_POST['email'].'<br />';
$body .= '<strong>Сообщение:</strong> '.$_POST['message'];

$header = "Content-type: text/html; charset=\"utf-8\"\r\n";
$header .= "From: ".$from."\r\n";

if (mail($send_to, $subject, $body, $header)) {
	$response['status'] = 'sent';
}

echo json_encode($response);
?>