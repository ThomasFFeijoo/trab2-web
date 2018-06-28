<?php

class IndexController extends AbstractBaseController
{

    public function indexAction()
    {
        
        $data = new Application_PagSeguro_PagSeguroData();
        $id = $this->getParam('id');
        if(!$id) {
            $id = 9;
        }
        $teste = $this->requester($id);
        $json_decoded = json_decode(json_decode($teste, true), true);
        $produtos = array();
        $preco = 0;

        foreach ($json_decoded['shoppingCart'] as $row => $key) {
            if(is_numeric($row)) {
                $produto = $this->getProduto($row);
                $decodado = json_decode($produto,true);
                array_push($produtos, $decodado['nome']);
                $preco += $decodado['preco'];
            }

        }

        $this->view->produtos = $produtos;
        $this->view->preco = $preco;
        $this->view->identificador = $id;
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

    private function requester($id) {
        $ch = curl_init("http://35.198.42.142:3000/carts/".$id);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $aqui = curl_exec($ch);
        curl_close($ch);
        return $aqui;
    }

    private function getProduto($id) {
        /*$ch = curl_init("http://150.162.244.102:3000/pesquisaPorId?id=".$id);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $aqui = curl_exec($ch);
        curl_close($ch);*/

        $aqui = '{"nome": "hellow", "categoria": "String", "descricao": "String", "vendedor": "String", "preco": 20}';
        return $aqui;
    }

    
    
}
