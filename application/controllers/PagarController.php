<?php

class PagarController extends AbstractBaseController
{

    public function indexAction()
    {

    	$id = $this->getParam("id");
    	
    	$ch = curl_init();

        curl_setopt($ch, CURLOPT_URL,"http://35.198.42.142:3000/payCart/".$id);
        curl_setopt($ch, CURLOPT_POST, 1);

// in real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS, 
//          http_build_query(array('postvar1' => 'value1')));

// receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec ($ch);

curl_close ($ch);
exit();
    }
}