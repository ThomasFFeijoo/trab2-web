<?php

class PagarController extends AbstractBaseController
{

    public function indexAction()
    {

    	var_dump($this->getParam("id"));
    	exit();
    }
}