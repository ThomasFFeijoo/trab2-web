<?php

abstract class AbstractBaseController extends Zend_Controller_Action {

    /**
     * @var Zend_Controller_Action_Helper_Redirector
     */
    protected $_redirector = null;

    protected $response = null;

    public function init() {
        $this->_helper->viewRenderer->setNoRender();
        $this->_redirector = $this->_helper->getHelper('Redirector');
    }

    /**
     * @return Application_Model_Clientes
     * */
    protected function getUser() {
        $auth = Zend_Auth::getInstance();
        if ($auth->hasIdentity()) {
            $identity = $auth->getIdentity();
            $user = new Application_Model_Clientes((array)$identity);
            $mapper = new Application_Mapper_Clientes();
            $user = $mapper->find($user->getUserId());
            $auth->getStorage()->write($user);
            return $user;
        }
        return null;
    }

    /**
     * @return bool
     * */
    protected function isLogged() {
        $auth = Zend_Auth::getInstance();
        return $auth->hasIdentity();
    }

    protected function getClientIp() {
        $ipaddress = 'UNKNOWN';
        if (array_key_exists('HTTP_CLIENT_IP', $_SERVER))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if (array_key_exists('HTTP_X_FORWARDED', $_SERVER))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if (array_key_exists('HTTP_FORWARDED_FOR', $_SERVER))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if (array_key_exists('HTTP_FORWARDED', $_SERVER))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if (array_key_exists('REMOTE_ADDR', $_SERVER))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        return $ipaddress;
    }

    public function postDispatch() {
        if (null !== $this->response) {
            header('Content-Type: application/json; charset=utf-8');
            if ($this->response instanceof Application_Model_Error || $this->response instanceof Application_Model_Success) {
                echo Zend_Json::encode($this->response->printMessage());
            } else {
                echo Zend_Json::encode($this->response);
            }
        }
    }

    /**
     * Encerrar a sessao
     */
    public function logoutAction() {
        Zend_Auth::getInstance ()->clearIdentity ();
        $this->_helper->redirector ( 'index', 'index' ); // back to login page
    }
}