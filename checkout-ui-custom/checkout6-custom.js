// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

console.log("RODEIII")
try {
    var FocusCheckout = {
        init: function () {

        },
        windowOnload: function () {
            FocusCheckout.sellerConfig();
        },
        sellerConfig: function () {

            var vendedor = vendedor || {};
            vendedor.init = function () {
                vendedor.formAdd();
                vendedor.acao();
                vendedor.closeModal();
                vendedor.removeError();
                vendedor.checkVendedor();
                console.log('init');
            }

            // RENDERIZANDO CAMPO VENDEDOR
            vendedor.formAdd = function () {
                var sellerCode = `
                    <div class="seller-code">
                        <form action="" class="seller-code-form">
                            <div class="seller-code-label">
                                <label for="sellerCode">Código do vendedor</label>
                            </div>
                            <div class="seller-code-input">
                                <input type="text" name="sellerCode" id="sellerCode" placeholder="Código">
                                <button type="submit" id="seller-code-btn">OK</button>
                            </div>
                            <div class="seller-code-result">
                                <div class="seller-code-result-name">
                                </div>
                                <button class="seller-code-result-fechar">
                                    <i class="icon-close"></i>
                                </button>
                            </div>
                        </form>
                    </div>`;
                if (!$('.seller-code').length) {
                    $('.body-cart .checkout-container .cart-template .span5.totalizers.summary-totalizers.cart-totalizers.pull-right .coupon-column').append(sellerCode);
                }
            }

            vendedor.consulta = function (idConsulta, origem) {
                ;
                $('.loading.loading-bg').css('display', 'block');

                $.ajax({
                    url: '/api/dataentities/VD/search?sellerCode=' + idConsulta + '&_fields=sellerCode,nome',
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                    success: function (response) {
                        if (response.length) {
                            var nomeVendedor = response[0].nome;
                            var codigoVendedor = response[0].codigo;
                            if (idConsulta == codigoVendedor) {
                                vtexjs.checkout.getOrderForm().then(function (orderForm) {
                                    var newMarketingData = orderForm.marketingData;

                                    if (newMarketingData == null) {
                                        newMarketingData = {
                                            'utmiCampaign': 'descontovendedor'
                                        }
                                    } else {
                                        newMarketingData.utmiCampaign = 'descontovendedor';
                                    }
                                    vtexjs.checkout.sendAttachment('openTextField', { value: "Vendedor - nome:" + nomeVendedor + " / código: " + codigoVendedor });
                                    vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
                                        localStorage.setItem('sellercode', JSON.stringify(response[0]));
                                        vendedor.showVendedor(codigoVendedor);
                                        $('.loading.loading-bg').css('display', 'none');
                                    });

                                })

                            }
                        } else {
                            vendedor.error();

                            $('.loading.loading-bg').css('display', 'none');
                        }

                    },
                    error: function (err) {
                        vendedor.error();
                        console.error('Erro:', err.responseText);
                    }
                });
            }

            vendedor.showVendedor = function (codigo) {
                $('input#sellerCode').val(codigo)
                $('.seller-code-input').hide();
                $('.seller-code-result').css('display', 'inline-flex');
                $('.seller-code-result-name').html(codigo);

            }

            vendedor.removeVendedor = function () {

                $('.loading.loading-bg').css('display', 'block');
                $('.seller-code-input input').val('');
                $('.seller-code-result').hide();
                $('.seller-code-input').show();
                // Cookies.remove('cdv');
                vtexjs.checkout.getOrderForm().then(function (orderForm) {
                    var newMarketingData = orderForm.marketingData;
                    const utmiEmptyMessage = 'Sem vendedor';

                    newMarketingData.utmiCampaign = utmiEmptyMessage;
                    newMarketingData.utmiPart = utmiEmptyMessage;

                    vtexjs.checkout.sendAttachment('marketingData', newMarketingData).done(function () {
                        localStorage.removeItem('sellercode');

                        $('.loading.loading-bg').css('display', 'none');

                        vtexjs.checkout.getOrderForm().then(function (orderForm) {
                            return vtexjs.checkout.sendAttachment('openTextField', { 'value': null })
                        })
                    });
                });
            }

            vendedor.acao = function () {
                console.log('Ação');

                $(document).on('click', '#seller-code-btn', function (e) {
                    e.preventDefault();

                    var idConsulta = $(document).find('.seller-code-input input').val().toLowerCase();
                    var origem = 'btn';

                    if (idConsulta.length > 0) {
                        vendedor.consulta(idConsulta, origem);
                        $(document).find('.seller-code-error').remove();
                    }

                    return false;
                });

                $(document).on('click', '.seller-code-result-fechar', function () {
                    vendedor.removeVendedor();
                    return false;
                });
            }

            vendedor.error = function () {
                $('.seller-code-form').append('<span class="seller-code-error">Código inválido. Por favor, tente novamente.</span>');
            }

            vendedor.removeError = function () {
                $('.seller-code-input input').on('focus', function () {
                    $('.seller-code-error').remove();
                    $('#seller-code-btn').removeAttr('disabled');
                });
            }

            vendedor.closeModal = function () {
                $(document).on('click', function () {
                    $('.seller-code-modal').remove().fadeIn();
                });
            }

            vendedor.checkVendedor = function () {
                var objVendedor = JSON.parse(localStorage.getItem('sellercode'));
                if (objVendedor) {
                    vendedor.showVendedor(objVendedor.codigo);
                }
            }

            var checkelementsTimer = function () {
                $('.body-cart .checkout-container .cart-template .coupon-form .coupon-value').attr('placeholder', 'Cupom').attr('name', 'cart-coupon');

                if ($(".body-cart .checkout-container .cart-template .span5.totalizers.summary-totalizers.cart-totalizers.pull-right .coupon-column").length) {
                    clearInterval(checkElements);
                }

            };

            var checkElements = setInterval(function () {
                checkelementsTimer();
                vendedor.init();
            }, 1000);

        }
    }

    FocusCheckout.init();
    let windowLoad = function () {
        FocusCheckout.windowOnload();
    };
    $(window).load(windowLoad);

} catch (e) {
    console.log("Error in: Focuscheckout: ", e);
}
