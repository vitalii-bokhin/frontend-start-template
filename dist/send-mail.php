<?php
/*
session_start();

$csrf = md5('sss'.rand(1,999));

$_SESSION['csrf'] = $csrf;
*/
?>


<?php
session_start();

$response = array();

if ($_SESSION['csrf'] == $_POST['csrf']) {

    $send_to = $_POST['send_to'];
    $from = (!empty($_POST['from'])) ? $_POST['from'] : 'site.com <info@site.com>';
    
    $subject = (!empty($_POST['subject'])) ? $_POST['subject'] : $from;
    
    $body = '';
    
    if (!empty($_POST['name'])) {
        $body .= '<strong>Имя:</strong> '. $_POST['name'] .'<br />';
    }
    
    if (!empty($_POST['email'])) {
        $body .= '<strong>E-mail:</strong> '. $_POST['email'] .'<br />';
    }
    
    if (!empty($_POST['message'])) {
        $body .= '<strong>Сообщение:</strong> '. $_POST['message'];
    }
    
    $header = "Content-type: text/html; charset=\"utf-8\"\r\n";
    $header .= "From: ". $from ."\r\n";
    
    if (mail($send_to, $subject, $body, $header)) {
        $response['status'] = 'sent';
    } else {
        $response['status'] = 'error';
    }
    
} else {
    $response['status'] = 'error';
}

echo json_encode($response);
?>