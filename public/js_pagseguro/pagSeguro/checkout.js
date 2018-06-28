// Setting the application NameSpace
var MyApplication = window.MyApplication || {};
MyApplication.CheckoutPage = new function() {

    var hasSessionId = false; // Inicia sem sessionId

    var updateSessionId = function(callback) {

        showLoading();

        $.ajax({
            url: "/session",
            type:"GET",
            cache: false,
            success: function(response) {
                PagSeguroDirectPayment.setSessionId(response);
                hasSessionId = true;
                cardBrandEvents();

            },
            error: function() {
                alert(" Não foi possível obter o Session ID do PagSeguro, recarregue a página ");
            },
            complete: function() {
                hideMessages();
            }
        });

    };

    // Atualiza dados de parcelamento atráves da bandeira do cartão
    var updateInstallments = function(brand) {

        var amount = Number($("#totalValue").html());

        PagSeguroDirectPayment.getInstallments({
            amount: amount,
            brand:  brand,
            success: function(response) {

                // Para obter o array de parcelamento use a bandeira como "chave" da lista "installments"
                var installments = response.installments[brand];

                var options = '';
                for (var i in installments) {

                    var optionItem     = installments[i];
                    var optionQuantity = optionItem.quantity; // Obtendo a quantidade
                    var optionAmount   = optionItem.installmentAmount; // Obtendo o valor
                    var optionLabel    = (optionQuantity + "x " + formatMoney(optionAmount)); // montando o label do option
                    var price          = Number(optionAmount).toMoney(2,'.',',');

                    options += ('<option value="' + optionItem.quantity + '" dataPrice="'+price+'">'+ optionLabel +'</option>');

                };

                // Atualizando dados do select de parcelamento
                $("#installmentQuantity").html(options);

                // Exibindo select do parcelamento
                $("#installmentsWrapper").show();

                // Utilizando evento "change" como gatilho para atualizar o valor do parcelamento
                $("#installmentQuantity").trigger('change');

            },
            error: function(response) {

            },
            complete: function(response) {

            }
        });

    };


    var updateCardBrand = function(cardBin) {
        PagSeguroDirectPayment.getBrand({

            cardBin: cardBin,

            success: function(response) {
                var brand = response.brand.name;

                $("#cardBrand").attr('brand', brand);
                $("#creditCardBrand").val(brand);

                updateInstallments(brand);

            },

            error: function(response) {

            },

            complete: function(response) {

            }

        });

    };

    var changeMethod = function(method) {

        var loading = $("#paymentMethodLoading");

        loading.show();

        var showBox = function() {

            var allMethods = $(".paymentMethodGroup");
            var thisMethod = allMethods.filter("[dataMethod='"+method+"']");

            allMethods.hide();
            thisMethod.show();
            loading.hide();

        };
        if (hasSessionId) {
            showBox();
        } else {
            // obter sessioId se ainda não foi setado
            updateSessionId(showBox);
        }

    };


    var updateCardToken = function(callback) {
        PagSeguroDirectPayment.createCardToken({

            cardNumber: $("#creditCardNumber").val(),
            brand: $("#creditCardBrand").val(),
            cvv: $("#creditCardCVV").val(),
            expirationMonth: $("#creditCardDueDate_Month").val(),
            expirationYear: $("#creditCardDueDate_Year").val(),

            success: function(response) {

                // Obtendo token para pagamento com cartão
                var token = response.card.token;
                // Executando o callback (pagamento) passando o token como parâmetro
                callback(token);

            },

            error: function(response) {
                showCardTokenErrors(response.errors);

            },

            complete: function(response) {

            }

        });

    };


    // Fazer pagamento de qualquer tipo
    var doPayment = function() {
        // travando a tela (loading)
        //showLoading();

        // Adicionando dados do comprador aos parâmentros de pagamento
        //areaToParams("payment", params);

        // Adicionando dados dos items (carrinho) aos parâmetros de pagamento
        //addCartData(params);

        // Atualizando hash do comprador
        //params.senderHash = PagSeguroDirectPayment.getSenderHash();
        //params.cdplano = $('#captai__sidebar').data('value');
        
        // Request para o PHP passando os dados do pagamento
        console.log("http://35.198.42.142:3000/payCart/"+$('.identificador').data('value'));
        $.ajax({
            type:"POST",
            url: "http://35.198.42.142:3000/payCart/"+$('.identificador').data('value'),
            
            success: function(response) {
                // Executa o callback passado como parâmentro
                //callback(response.transaction);
                console.log("oi");
                showTransactionCode("sucesso");
            },
            error: function(jqxhr) {
                console.log(jqxhr);
                // Liberando a tela (esconde o loading)
                //hideMessages();

                // obtendo lista de erros
                //var response = $.parseJSON(jqxhr.responseText);

                // Exibindo lista de erros
                //showPaymentErrors(response.errors);

            }

        });

    };

    // Pagamento com cartão de crédito
    var creditCardPayment = function() {

        showLoading();

        //////////////////////////////////////
        // fazer validação nesse ponto;
        //////////////////////////////////////

        updateCardToken(function(cardToken) {

            // Atualizando field que deve conter o valor do token
            $("#creditCardToken").val(cardToken);

            var params = {
                paymentMethod: 'creditCard'
            };

            // Adicionando dados do cartão de crédito aos parâmentros de pagamento
            areaToParams("creditCardData", params);

            // Fazer pagamento via cartão de crédito passando um callback a ser executado no final
            doPayment(params);

        });

    };

    // Alerando tipo de meio de pagamento (cartão, boleto ou tef)
    var changeMethodEvents = function() {

        var radioInputs = $("input[name='changePaymentMethod']");
        radioInputs.click(function(){

            var method = $(this).val();

            changeMethod(method);

        });
        radioInputs.filter(":checked").trigger("click");
    };


    // Pagamento via cartão de crédito no click do "botão pagar"
    var creditCardPaymentEvents = function() {
        $("#creditCardPaymentButton").click(function(){
            doPayment();
        });
    };


    // Gerenciando bandeira do cartão
    var cardBrandEvents = function() {

        var verifyBrand = function() {
            // Obtendo apenas os 6 primeiros dígitos (bin)
            var cardBin = $("#creditCardNumber").val().substring(0, 6);

            // Atualizar Brand apenas se tiver 6 ou mais dígitos preenchidos
            if (String(cardBin).length >= 6) {

                // Atualizar Brand
                updateCardBrand(cardBin);

            } else {

                // Se não digitou o número do cartão, esconder parcelamento
                $("#installmentsWrapper").hide();

            }

        };

        // Verificar bandeira após qualquer mudança nos inputs de cartão de crédito
        $("#creditCardNumber").change(function(){
            verifyBrand();
        });

        // Verificar bandeira logo no início
        verifyBrand();

    };

    // Atualizando o valor do parcelamento
    var installmentQuantityEvents = function() {
        $("#installmentQuantity").change(function() {
            var option = $(this).find("option:selected");
            if (option.length) {
                $("#installmentValue").val( option.attr("dataPrice") );
            }
        });
    };

    var holderEvents = function() {

        var holderData = $("#fillPersonalData");

        // Usar dados do comprador para preencher dados do dono do cartão
        $("#useCardPersonalData").click(function(){

            $(".payment-step input[holderField]").each(function(){
                var fieldRef = $(this).attr('holderField');
                var value = $(this).val();
                holderData.find("input[holderField=\""+fieldRef+"\"]").val(value);
            });

            $("#creditCardHolderBirthDate").focus();
            holderData.show();

        });

        // limpar dados do dono do cartão para preecher novo
        $("#otherPersonalData").click(function(){
            holderData.find("input").val('');
            $("#creditCardHolderBirthDate").focus();
        });

        // Verificar no início
        $("input[name='holderType']:checked").trigger('click');

    };

    var enderecoEvents = function() {

        var holderData = $("#cardBillingAddress");

        // Usar dados do comprador para preencher dados do dono do cartão
        $("#cardSameOfShipping_T").click(function(){
            $("#shippingAddress input[holderField]").each(function(){
                var fieldRef = $(this).attr('holderField');
                var value = $(this).val();
                holderData.find("input[holderField=\""+fieldRef+"\"]").val(value);
            });


            holderData.find('.field').show();
            //holderData.show();

        });

        // limpar dados do dono do cartão para preecher novo
        $("#otherHolder").click(function(){
            holderData.find("input").val('');
            holderData.show();
        });

        // Verificar no início
        $("input[name='holderType']:checked").trigger('click');

    };

    // Adicionar dados do carrinho aos parâmetros de pagamento
    var addCartData = function(params) {

        $("#cartTable tbody tr").each(function(index, element){
            $(element).find("td").each(function(){
                if($(this).attr("data-name")) {
                    if (startsWith($(this).attr("data-name"),"itemAmount")) {
                        params[$(this).attr("data-name") + (index+1)] = $(this).html().replace(",",".");
                    } else {
                        params[$(this).attr("data-name") + (index+1)] = $(this).html();
                    }
                }
            });
        });

    };

    // Eventos do carrinho (adicioanr item)
    var cartEvents = function() {

        $("#addItem").click(function(){

            $.colorbox({
                html: $("#cartItemHidden").html(),
                fixed: true
            });

            $("#colorbox .addToCart").unbind('click').bind('click', function(){

                var parent     = $(this).parents(".cartItemFields");
                var itemid     = parent.find(".itemId").val();
                var descr      = parent.find(".itemDescription").val();
                var amount     = Number(parent.find(".itemAmount").val().replace(",", "."));
                var qty        = Number(parent.find(".itemQuantity").val());
                var itemValue  = (amount * qty);

                var html  = ("<tr>");
                html += ("<td data-name='itemId'>" + itemid + "</td>");
                html += ("<td data-name='itemDescription'>" + descr + "</td>");
                html += ("<td data-name='itemAmount'>" + amount.toMoney(2, ',', '.') + "</td>");
                html += ("<td data-name='itemQuantity'>" + qty + "</td>");
                html += ("<td>" + itemValue.toMoney(2, ',', '.') + "</td>");
                html += ("</tr>");

                $("#cartTable tbody").append(html);

                var total = Number($("#totalValue").html());
                total = total + itemValue;

                $("#totalValue").html(total.toMoney(2, '.', ','));

                if ($("#installmentQuantity").val() != "") {
                    updateInstallments( $("#creditCardBrand").val() );
                }

                $.colorbox.close();

            });

        });

    };


    // Pagamento com TEF
    var eftEvents = function() {

        $(".bank-flag").click(function(){
            var bank = $(this).attr("dataBank");
            var params = {
                paymentMethod: 'eft',
                bankName: bank
            };
            doPayment(params, function(transaction){
                window.open(transaction.paymentLink);
                showWaitingPayment("Débito online");
            });
        });

    };


    // Pagamento com boleto
    var boletoEvents = function() {

        $("#boletoButton").click(function(){
            var params = {
                paymentMethod: 'boleto'
            };
            doPayment(params, function(transaction){
                window.open(transaction.paymentLink);
                showWaitingPayment("Pagamento com Boleto...");
            });
        });

    };




    // Aplicando eventos apenas quado o documento estiver pronto
    $(document).ready(function(){
        updateSessionId();
        cartEvents();
        changeMethodEvents();
        holderEvents();
        enderecoEvents();
        creditCardPaymentEvents();
        installmentQuantityEvents();
        eftEvents();
        boletoEvents();
    });

};
