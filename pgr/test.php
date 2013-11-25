<?php 
	require_once('recaptchalib.php');
	$privatekey = "6Lf1Z-oSAAAAALQA7XBiogtwa8gECDkzYg7n6Ewz";
	$resp = recaptcha_check_answer ($privatekey,
	                            $_SERVER["REMOTE_ADDR"],
	                            $_POST["recaptcha_challenge_field"],
	                            $_POST["recaptcha_response_field"]);

	if (!$resp->is_valid) {
		echo("0");
	} else {
		echo("1");
	}
?>