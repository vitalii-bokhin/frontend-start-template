<?php
$send_to = 'mail@gmail.com'; // куда отправляем
$from = 'site.com <info@site.com>'; // отправитель (обязательно подставить домен сайта в <info@..домен...>)

$subject = 'Тема письма'; // тема письма

$body = '<strong>Имя:</strong> '.$_POST['yourName'].'<br />';
$body .= '<strong>Телефон:</strong> '.$_POST['yourPhone'].'<br />';
$body .= '<strong>Где планируете делать ремонт:</strong> '.$_POST['nertype'].'<br />';

if ($_POST['no']) {
	$body .= '<strong>Площадь не помнят</strong><br />';
} else {
	$body .= '<strong>Площадь:</strong> '.$_POST['send-result-polzunok'].'<br />';
}

$body .= '<strong>Количество комнат:</strong> '.$_POST['orderRoof'].'<br />';
$body .= '<strong>Как скоро вам необходимо приступить к ремонту:</strong> '.$_POST['orderRoof33'].'<br />';
$body .= '<strong>Ремонт будем делать по дизайн-проекту?:</strong> '.$_POST['orderRoof22'];

$header = "Content-type: text/html; charset=\"utf-8\"\r\n";
$header .= "From: ".$from."\r\n";

if (mail($send_to, $subject, $body, $header)) {
	echo 'Письмо отправлено';
}
?>