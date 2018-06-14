$("#cardBillingAddressPostalCode").on("blur", function() {
    pesquisacep(this.value);
});

function pesquisacep(valor) {
    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {
        //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('cardBillingAddressStreet').value = "...";
            document.getElementById('cardBillingAddressDistrict').value = "...";
            document.getElementById('cardBillingAddressCity').value = "...";
            document.getElementById('billingAddressState').value = "...";
            $('#cardBillingAddress').find('.field').show();

            $.ajax({
                url: 'https://api.postmon.com.br/v1/cep/'+cep,
                type:"GET",
                success: function(response) {
                    meu_callback(response);
                },
                error: function(response) {
                    limpa_formulario_cep();
                }
            });
        } //end if.
        else {
            //cep é inválido.
            limpa_formulario_cep();
            //alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulario_cep();
    }
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('cardBillingAddressStreet').value = (conteudo.logradouro);
        document.getElementById('cardBillingAddressDistrict').value = (conteudo.bairro);
        document.getElementById('cardBillingAddressCity').value = (conteudo.cidade);
        document.getElementById('billingAddressState').value = (conteudo.estado);

    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulario_cep();
        alert("CEP não encontrado.");
    }
}

function limpa_formulario_cep(id) {
    //Limpa valores do formulário de cep.
        document.getElementById('cardBillingAddressStreet').value = ("");
        document.getElementById('cardBillingAddressDistrict').value = ("");
        document.getElementById('cardBillingAddressCity').value = ("");
        document.getElementById('billingAddressState').value = ("");
}

$('#senderPhone, #senderCPF, #shippingAddressPostalCode, #creditCardNumber, #senderAreaCode, #creditCardDueDate_Month, ' +
    '#creditCardDueDate_Year, #creditCardCVV, #billingAddressPostalCode, #holderCPF, #holderAreaCode, ' +
    '#holderPhone').keypress(function(){
    mask(this, onlyNumbers);
});

$("#creditCardHolderBirthDate").keypress(function(){
    mask(this,Data);
});


function mask(o, f) {
    setTimeout(function () {
        var v = f(o.value);
        if (v != o.value) {
            o.value = v;
        }
    }, 1);
}


function onlyNumbers(v) {
    //var r = v.replace(/\D/g,"");
    //r = r.replace('^\\d+$',"");

    return v.replace(/\D/g,"")
}

/*Função que padroniza DATA*/

function Data(v){
    v=v.replace(/\D/g,"");
    v=v.replace(/(\d{2})(\d)/,"$1/$2");
    v=v.replace(/(\d{2})(\d)/,"$1/$2");
    return v;
}