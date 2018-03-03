<?php
$mail = "lufter21@gmail.com";

$subject = "Заявка с сайта dealersair.com";

$utext = '<strong>Имя:</strong> '.$_POST['name'].'<br />';
$utext .= '<strong>Телефон:</strong> '.$_POST['tel'].'<br />';
$utext .= '<strong>Сообщение:</strong> '.$_POST['message'];

$header = "Content-type: text/html; charset=\"utf-8\"\r\n";
$header .= "From: dealersair.com <info@dealersair.com>\r\n";

if (mail($mail, $subject, $utext, $header)) {
	echo 'send';
}

?>