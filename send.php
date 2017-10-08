<?php
$mail="lufter21@gmail.com";
$utext = '<strong>Телефон:</strong> '.$_POST['tel'].'<br />';
$title="Заявка с сайта dealersair.com";
$header="Content-type: text/html; charset=\"utf-8\"\r\n";
$header.="From: dealersair.com <info@dealersair.com>\r\n";
if (mail($mail,$title,$utext,$header)) {
	echo "Форма отправлена";
} else {
	echo "Server Error";
}
?>