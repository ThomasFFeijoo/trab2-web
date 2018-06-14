<?php
	
	class Application_PagSeguro_PagSeguroData {
		
		private $sandbox;
		
		private $sandboxData = Array(
			
			'credentials' => array(
				"email" => "cabral@scrapi.com.br",
				"token" => "BD572FD0880A4646AF6F6396FFA95099"
			),
			
			'sessionURL' => "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions",
			'transactionsURL' => "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions",
            'transactionsURL' => "https://ws.sandbox.pagseguro.uol.com.br/pre-approvals",
			'javascriptURL' => "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js"
		);
		
		private $productionData = Array(
			
			'credentials' => array(
                "email" => "thomas@scrapi.com.br",
                "token" => "D7903454917842F39879933736C8D41E"
			),
			
			'sessionURL' => "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions",
			'transactionsURL' => "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions",
            'transactionsURL' => "https://ws.sandbox.pagseguro.uol.com.br/pre-approvals",
			'javascriptURL' => "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js"
			
		);
		
		public function __construct($sandbox = false) {
			$this->sandbox = (bool)$sandbox;
		}
		
		private function getEnviromentData($key) {
			if ($this->sandbox) {
				//return $this->sandboxData[$key];
                return $this->productionData[$key];
			} else {
				return $this->productionData[$key];
			}
		}
		
		public function getSessionURL() {
			return $this->getEnviromentData('sessionURL');
		}
		
		public function getTransactionsURL() {
			return $this->getEnviromentData('transactionsURL');
		}
		
		public function getJavascriptURL() {
			return $this->getEnviromentData('javascriptURL');
		}
		
		public function getCredentials() {
			return $this->getEnviromentData('credentials');
		}
		
		public function isSandbox() {
			return (bool)$this->sandbox;
		}
		
	}
	
?>
