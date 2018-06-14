/**
 *   Functions for login Users
 *   Created By Digital Prospect
 */


/**
 *   Variaveis Globais
 *
 */

var login;
var pass;
var form = new FormData();

$(document).ready(function () {

    $(document).keydown(function(clickEvent) {
        if (clickEvent.keyCode == 13) {
            $('#loginBtn').prop('disabled',true)
            executar()
            $('#loginBtn').prop('disabled',false)
        }
    })

    $('#loginBtn').click(function () {

        $(this).prop('disabled',true);
        executar();
        $(this).prop('disabled',false);
    });

    function executar() {
        login = $('#account_mail').val().trim();
        pass = $('#account_password').val();
        var error_input = false;
        removeAllErrosExplanation();
        error_input = (error_input | showInputError('#account_mail', login, ' (email estÃƒÂ¡ em branco)', '#alert_email'));
        error_input = (error_input | showInputError('#account_password', pass, '(senha estÃƒÂ¡ em branco)', '#alert_password'));
        if (error_input) {
            return;
        }

        if(!validateEmail(login)) {
            $('#account_mail').addClass("error");
            addErrorExplanation(' (email invÃƒÂ¡lido)', '#alert_email');
            return;
        } else { $('#account_mail').removeClass("error"); }
        if(pass.length < 6) {
            $('#account_password').addClass("error");
            addErrorExplanation('(senha com no minimo 6 caracteres)','#alert_password');
            return;
        } else { $('#account_password').removeClass("error"); }

        $('#main_error').hide();
        $('#loading').html('Entrando<span>.</span> <span>.</span> <span>.</span>');
        $('#loading').show();
        logar();
    }

    function logar() {
        form.append("email", login);
        form.append("password", pass);

        $.ajax({
            type: 'POST',
            url: '/auth',
            data: form,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function (data) {
            },
            complete: function (data) {
            },
            success: function (data) {
                if(data['status'] == 'error') {
                    $('#loading').hide();
                    $('#main_error').html("<p>"+data['message']+"</p>");
                    $('#main_error').show();
                } else if(data['status'] == 'ok') {
                    if(data['redirect'] == '1') {
                        var page = "/planos/um?hash=".concat(data['hash']);
                        window.location.replace(page);
                    } else {window.location.replace('/');}
                }
            },
            error: function (data) {
                console.log("error ajax login usuario");
            }
        });
    }



    function showInputError(id, toCheck, error_message, alert_id) {
        if (checkEmpty(toCheck)) {
            $(id).addClass("error");
            addErrorExplanation(error_message, alert_id);
            return true;
        } else {
            $(id).removeClass("error");
            return false;
        }
    }

    function checkEmpty(str) {
        return (str == null || str == "");
    }

    function showInputError(id, toCheck, error_message, alert_id) {
        if (checkEmpty(toCheck)) {
            $(id).addClass("error");
            addErrorExplanation(error_message, alert_id);
            return true;
        } else {
            $(id).removeClass("error");
            return false;
        }
    }

    function checkEmpty(str) {
        return (str == null || str == "");
    }

    function addErrorExplanation(str_html, alert_id) {
        $(alert_id).text(str_html);
        $(alert_id).show();
        return true;
    }

    function removeAllErrosExplanation() {
        $("#alert_email").hide();
        $("#alert_password").hide();
        return true;
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

});
