<?php

class IndexController extends AbstractBaseController
{

    public function indexAction()
    {
        
        $data = new Application_PagSeguro_PagSeguroData();
        $this->view->pagSeguroData = $data;
        $this->_helper->viewRenderer->render();
    }
    
    


    /**
     * Action que gera um Session Id para ser usado em sessões PagSeguro
     */
    public function sessionAction() {
        $checkout = new Application_PagSeguro_Checkout();
        $checkout->printSessionId();
    }

    
    
}
