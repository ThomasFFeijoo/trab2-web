<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {

    protected function _initResourceAutoloader() {
        $autoloader = new Zend_Loader_Autoloader_Resource(array(
            'basePath' => APPLICATION_PATH,
            'namespace' => 'Application',
        ));
        Zend_Session::setOptions(array('cookie_httponly' => true));

        $autoloader->addResourceType('mapper', 'models/mappers', 'Mapper')
        -> addResourceType('sqlsearchmaker', 'models/SqlSearchMaker', 'SqlSearchMaker')
        -> addResourceType('pagseguro','models/PagSeguro', 'PagSeguro')
        -> addResourceType('recaptcha','models/recaptcha', 'Recaptcha')
        -> addResourceType('mensagens','models/mensagens', 'Mensagens')
        -> addResourceType('algoritmo', 'models/algoritmos', 'Algoritmo')
        -> addResourceType('dailyscripts', 'models/dailyscripts', 'DailyScripts')
        -> addResourceType('crawler', 'models/crawlers', 'Crawler');
        Zend_Loader::loadClass('AbstractBaseController',
            array(
                APPLICATION_PATH . '/controllers'
            )
        );
        return $autoloader;
    }





}
