/**
 * Created by aa on 14.08.2017.
 */
var DEBUG = false;
$(document).ready(function () {



    //Predefined variables
    const _exchangeRate = 28, // Exchange rate for 1 dollar

        _defectiveSheets = [
            {"add": 1, "min": 1, "max":30},
            {"add": 2, "min": 30, "max":100},
            {"add": 3, "min": 100, "max":200},
            {"add": 4, "min": 200, "max":500},
            {"add": 5, "min": 500, "max":Infinity},
        ], // Листов на брак
        _cutpriceRect = [
            {"price": 0.12, "min": 1, "max": 20},
            {"price": 0.09, "min": 20, "max": 50},
            {"price": 0.08, "min": 50, "max": 100},
            {"price": 0.07, "min": 100, "max": Infinity}
        ], //Цена за порезку прямоугольных наклеек
        _cutpriceSimplecircuit = [
            {"price": 0.5, "min": 1, "max": 20},
            {"price": 0.45, "min": 20, "max": 50},
            {"price": 0.4, "min": 50, "max": 100},
            {"price": 0.35, "min": 100, "max": Infinity}
        ], //Цена за порезку наклеек простой формы
        _cutpriceHardcircuit = [
            {"price": 0.9, "min": 1, "max": 20},
            {"price": 0.85, "min": 20, "max": 50},
            {"price": 0.8, "min": 50, "max": 100},
            {"price": 0.7, "min": 100, "max": Infinity}
        ], //Цена за порезку наклеек сложной формы
        _stampingprice = 10, // Цена за тиснение
        _varnishprice = 20, // Цена покрытия уф-лаком
        _laminationprice = 0.25, // Цена ламинации за лист
        _paperlist = 0.11, // Цена за лист бумаги
        _plasticlist = 0.9, // Цена за лист пластика
        _delivery = 1, // Доставка
        _postprint = 1, // Постпечатная подгодовка
        _profit = [
            {"price": 2, "min": 0, "max": 100},
            {"price": 1.9, "min": 100, "max": 200},
            {"price": 1.8, "min": 200, "max": 300},
            {"price": 1.7, "min": 300, "max": 500},
            {"price": 1.6, "min": 500, "max": 700},
            {"price": 1.55, "min": 700, "max": 1000},
            {"price": 1.5, "min": 1000, "max": 1500},
            {"price": 1.45, "min": 1500, "max": 2500},
            {"price": 1.4, "min": 2500, "max": 4500},
            {"price": 1.35, "min": 4500, "max": 10000},
            {"price": 1.3, "min": 10000, "max": 20000},
            {"price": 1.27, "min": 20000, "max": 30000},
            {"price": 1.25, "min": 30000, "max": 50000},
            {"price": 1.23, "min": 50000, "max": Infinity},
        ] // Навар :)

    var calcProp = {
        'form': '',
        'width': '',
        'height': '',
        'quantity': '',
        'type': '',
        'basis': '',
        'stamping': '',
        'varnish': '',
        'lamination': '',
        'print_time': '',
        'design': '',
        'cut_form' : '',
        'user_name' : '',
        'user_phone' : '',
        'user_mail' : '',
        'user_payment_method' : '',
        'user_delivery' : '',
        'user_delivery_district' : '',
        'user_contacts' : '',
        'user_comment' : ''

    };// Object to store all form data

    var formCalc = $('#sendorder'), //Form object
        rectlistparams = { //list parameters
            width: 310,
            height: 440
        },
        circuitlistparams = { //list parameters
            width: 280,
            height: 380
        },
        colorfularr = [
            {"price": 0.11, "min": 1, "max": 10},
            {"price": 0.09, "min": 10, "max": 750},
            {"price": 0.08, "min": 750, "max": Infinity}
        ], //Price for print in colors
        monochromearr = [
            {"price": 0.06, "min": 1, "max": 100},
            {"price": 0.05, "min": 100, "max": Infinity}
        ]; // Price for print in monochrome




    formCalc.find('input').on('keyup change', function () {

        updateVar($(this));
        switchDelivery();
        calculateStickersOnList();
        calculateTotal();

    });

    formCalc.find('input').focus(function(){
        notifyme(calcProp);
    });
    /**
     *
     * @param element - jquery object
     *
     * Add or update propery in calcProp object
     */
    function updateVar(element) {
        if (element.attr('type') == 'checkbox') {
            if (element.is(':checked')) calcProp[element.attr('name')] = element.val();
            else calcProp[element.attr('name')] = '';
        }
        else calcProp[element.attr('name')] = element.val();

    }

    function calculateTotal() {
        var totalprice, totalpricehrn, totalpriceprofit, totalpricehrncom, totalpriceonesticker, pricewithlamination;
        totalprice = calculatePrint() + calculateCut() + calculateBasis() + _delivery + _postprint;



        totalprice = totalprice+calculateLamination();
        totalprice = printUrgency(totalprice);


        totalpricehrn = totalprice * _exchangeRate;



        totalpriceprofit = addProfit(totalpricehrn, _profit);


        totalpricehrncom = totalpriceprofit + ((totalpriceprofit / 100) * 3);
        if(calcProp.user_delivery_district){
            totalpricehrncom = totalpricehrncom + calculateDelivery();
        }

        totalpriceonesticker = totalpricehrncom / calcProp.quantity;

        function printResults() {
            if(DEBUG){
                console.log('Кол-во наклеек на листе:' + calcProp.stickersonlist);
                console.log('Количество листов в печать:' + calcProp.numberoflist);
                console.log('Окончательная цена в у.е:' + totalprice.toFixed(2));
                console.log('Окончательная цена в грн.:' + totalpricehrn.toFixed(2));
                console.log('Окончательная цена в грн + надбавка:' + totalpriceprofit.toFixed(2));
                console.log('Окончательная цена +надбавка +3%:' + totalpricehrncom.toFixed(2));
                console.log('Окончательная цена за наклейку:' + totalpriceonesticker.toFixed(2));

            }
            if(isNaN(totalpricehrncom) || totalpricehrncom == Number.POSITIVE_INFINITY || totalpricehrncom == Number.NEGATIVE_INFINITY) totalpricehrncom = 0;
            $('#final-price span').text(totalpricehrncom.toFixed(2));

        }

        printResults();
    }

    //Функция добавления стоимости за срочность заказа

    function printUrgency(price){
        if(calcProp.print_time == 2){
            return price + (price*0.2);
        } else{
            return price;
        }
    }
    // Функция добавления наценки
    function addProfit(price, profitarray) {

        if(price){
            price = parseFloat(price.toFixed(2));
        }

        if (price <= 111) {
            return price + 100;
        }
        else {
            for (var i = 0; i < profitarray.length; i++) {
                var obj = profitarray[i];
                if (price >= obj.min && price <= obj.max) {
                    price = price * obj.price;
                    break;
                }
            }
            return price;
        }
    }

    //Функция расчета стоимости ламинации
    function calculateLamination(){
        if(calcProp.lamination){
            $('#laminationprice').html('Стоимость ламинации:'+calcProp.numberoflist * 0.25);
            return calcProp.numberoflist * 0.25;
        }
        else return 0;
    }

    // Функция расчета количества наклеек, помещаемых в лист
    function calculateStickersOnList() {
        if (!calcProp.width || !calcProp.height) {
            return;
        }
        else if (calcProp.width < 45 || calcProp.height < 45){
            switch (calcProp.form) {
                case 'Прямоугольная':
                    calcProp.stickersonlist = calculateFigures(circuitlistparams, calcProp);
                    break;
                case 'Простая форма':
                    calcProp.stickersonlist = calculateFigures(circuitlistparams, calcProp);
                    break;
                case 'Сложная форма':
                    calcProp.stickersonlist = calculateFigures(circuitlistparams, calcProp);
                    break;
            }
        }
        else {
            switch (calcProp.form) {
                case 'Прямоугольная':
                    calcProp.stickersonlist = calculateFigures(rectlistparams, calcProp);
                    break;
                case 'Простая форма':
                    calcProp.stickersonlist = calculateFigures(circuitlistparams, calcProp);
                    break;
                case 'Сложная форма':
                    calcProp.stickersonlist = calculateFigures(circuitlistparams, calcProp);
                    break;
            }
        }
    }

    //Функция расчета цены печати
    function calculatePrint() {
        var printtotal = 0,
            numberoflist = 0,
            printpricelist = 0;
        calcProp.numberoflist = Math.ceil(parseInt(calcProp.quantity) / calcProp.stickersonlist);
        console.log('Кол-во листов до брака:'+calcProp.numberoflist);


        //добавим ещё дополнительные листы на брак
        for (var i = 0; i < _defectiveSheets.length; i++) {
            var obj = _defectiveSheets[i];
            if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                calcProp.numberoflist += obj.add;
                $('#deffective').html('Брак составил: '+obj.add+' листов');
                console.log('Брак составил:'+obj.add+' Кол-во листов:'+calcProp.numberoflist);
                break;
            }
        }



        if (calcProp.type == 'Цветная') {
            for (var i = 0; i < colorfularr.length; i++) {
                var obj = colorfularr[i];
                if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                    printpricelist = obj.price;
                    break;
                }
            }

        }
        else if (calcProp.type == 'Черно-белая') {
            for (var i = 0; i < monochromearr.length; i++) {
                var obj = monochromearr[i];
                if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                    printpricelist = obj.price;
                    break;
                }
            }

        }
        printtotal = calcProp.numberoflist * printpricelist;
        return printtotal;
    }

    // Функция расчета стоимости порезки
    function calculateCut() {
        if(calcProp.width < 45 || calcProp.height < 45){
            switch (calcProp.form) {
                case 'Прямоугольная':
                    for (var i = 0; i < _cutpriceSimplecircuit.length; i++) {
                        var obj = _cutpriceSimplecircuit[i];
                        if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                            return calcProp.numberoflist * obj.price;
                            break;
                        }
                    }
                    break;
                case 'Простая форма':
                    for (var i = 0; i < _cutpriceSimplecircuit.length; i++) {
                        var obj = _cutpriceSimplecircuit[i];
                        if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                            return calcProp.numberoflist * obj.price;
                            break;
                        }
                    }
                    break;
                case 'Сложная форма':
                    for (var i = 0; i < _cutpriceHardcircuit.length; i++) {
                        var obj = _cutpriceHardcircuit[i];
                        if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                            return calcProp.numberoflist * obj.price;
                            break;
                        }
                    }
                    break;
            }
        } else {
            switch (calcProp.form) {
                case 'Прямоугольная':
                    for (var i = 0; i < _cutpriceRect.length; i++) {
                        var obj = _cutpriceRect[i];
                        if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                            return calcProp.numberoflist * obj.price;
                            break;
                        }
                    }
                    break;
                case 'Простая форма':
                    for (var i = 0; i < _cutpriceSimplecircuit.length; i++) {
                        var obj = _cutpriceSimplecircuit[i];
                        if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                            return calcProp.numberoflist * obj.price;
                            break;
                        }
                    }
                    break;
                case 'Сложная форма':
                    for (var i = 0; i < _cutpriceHardcircuit.length; i++) {
                        var obj = _cutpriceHardcircuit[i];
                        if (calcProp.numberoflist >= obj.min && calcProp.numberoflist <= obj.max) {
                            return calcProp.numberoflist * obj.price;
                            break;
                        }
                    }
                    break;
            }
        }
    }

    // Функция расчета цены основы
    function calculateBasis() {
        switch (calcProp.basis) {
            case 'Бумажная':
                return calcProp.numberoflist * _paperlist;
                break;
            case 'Пластиковая':
                return calcProp.numberoflist * _plasticlist;
                break;
        }
    }
    // Функция расчета стоимости доставки
    function calculateDelivery() {
        switch(calcProp.user_delivery_district){
            case 'Центр, Молдаванка' :
                return 30;
                break;
            case 'Черемушки, Таирова, Фонтан' :
                return 40;
                break;
            case 'Пос. Котовского' :
                return 50;
                break;
            default :
                return 0;
        }
    }







    /**
     * Count an amount of how many stickers can be placed on one paper
     * @param FigureA - object conatining width and height of paper
     * @param list - user defined sitcker width and height
     * @returns {number} - max number of stickers placed on a paper
     */
    function calculateFigures(FigureA, list) {
        var total1 = 0,
            total2 = 0,
            FigureB = {};

        FigureB.width = parseInt(list.width) + 2;
        FigureB.height = parseInt(list.height) + 2;


        (function () {
            var figures_per_row = Math.floor(FigureA.width / FigureB.width),
                figures_per_col = Math.floor(FigureA.height / FigureB.height),
                invers_figures_per_row = 0,
                invers_figures_per_col = 0;

            if (FigureA.width - (figures_per_row * FigureB.width) >= FigureB.height) {
                invers_figures_per_row = Math.floor((FigureA.width - (figures_per_row * FigureB.width)) / FigureB.height);
                invers_figures_per_col = Math.floor(FigureA.height / FigureB.width);
            }

            total1 = (figures_per_row * figures_per_col) + (invers_figures_per_row * invers_figures_per_col);
        }());

        (function () {
            var figures_per_row = Math.floor(FigureA.width / FigureB.height),
                figures_per_col = Math.floor(FigureA.height / FigureB.width),
                invers_figures_per_row = 0,
                invers_figures_per_col = 0;

            if (FigureA.width - (figures_per_row * FigureB.height) >= FigureB.width) {
                invers_figures_per_row = Math.floor((FigureA.width - (figures_per_row * FigureB.height)) / FigureB.width);
                invers_figures_per_col = Math.floor(FigureA.height / FigureB.height);
            }

            total2 = (figures_per_row * figures_per_col) + (invers_figures_per_row * invers_figures_per_col);
        }());

        return Math.max(total1, total2);
    }


    //Управление попапом калькулятора

    // the location of server-side upload handler:
    $('#upload').fileupload({
        url: 'assets/vendor/fupload/server/php/',
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('#fileformlabel').append('<i class="icon-checkmark"></i>'+file.name+'<br />');
                $('#user_files').val($('#user_files').val() + '\n' + file.url);
                //$('<p/><i class="icon-checkmark"></i>').text(file.name).appendTo('#fileformlabel');
            });
        },
        error: function(info){
            console.log('info');
        }
        // progressall: function (e, data) {
        //     var progress = parseInt(data.loaded / data.total * 100, 10);
        //     $('#progress .progress-bar').css(
        //         'width',
        //         progress + '%'
        //     );
        // }
    });

    //Шаги формы
    function switchStep(step){
        $('#part-1, #part-2, #part-3').css('display','none');
        $('.form-step-wrapper').each(function () {
            if(parseInt($(this).children('.btn-step').attr('data-step'))>step) $(this).removeClass('active');
        });
        $('i.btn-step[data-step*='+step+']').parent().addClass('active');
        $('#part-'+step).show();
    }
    $('.btn-step').each(function () {
        $(this).click(function(){
            var step = parseInt($(this).attr('data-step'));
            console.log(step+' шаг');
            switch (step){
                case 1:
                    switchStep(1);
                    break;
                case 2:
                    switchStep(2);
                    break;
                case 3:
                    switchStep(3);
                    break;
            }

        });
    });

    //Показываем поля доставки при выбранном пункте
    function switchDelivery() {
        if (DEBUG) console.log('function run');

        var $form_delivery = $('#form_delivery'),
            $form_contacts = $('#form_contacts');
        if(calcProp.user_delivery == 'Новая Почта'){
            console.log('111');
            $form_delivery.hide();
            $form_contacts.show();
        }
        else if(calcProp.user_delivery == 'Доставка по Одессе'){
            $form_delivery.show();
            $form_contacts.show();
        } else if (calcProp.user_delivery == 'Самовывоз'){
            $form_delivery.hide();
            $form_contacts.hide();
        }
    }

    // Переключаем скрытые поля у радиобаттонов, при их выборе

    $("#form-calculator #part-2 .frm_opt_container > .col-sm-4 .designselector").click(function(){
        var $this = $(this);

        $('#form-calculator #part-2 .frm_opt_container > .col-sm-4 .designselector').not($this).each(function(){
            var $other = $(this);
            $other.removeClass('active');
        });

        $this.addClass('active');
    });


    //notification if something goes wrong
    function notifyme(Calc) {
        var $calc = Calc;
        if($calc.form == 'Прямоугольная' && ($calc.width >308 || $calc.height > 438)){
            $.notify("Размер наклеек прямоугольной формы не может превышать 438х308мм", "warn",{position:"top left"});
        }
        if(($calc.form == 'Простая форма' || $calc.form == 'Сложная форма') && ($calc.width > 278 || $calc.height > 378)){
            $.notify("Размер наклеек простой и сложной формы не может превышать 378х278мм. Попрбуйте прямоугольные наклейки", "warn", {position:"top left"});
        }
    }
    //
    (function () {
        var clicked = false;
        //lamination click
        $('#field_profile-110').click(function(){
            if (!clicked) $('#field_profile-113').trigger('click');
            clicked = true;
        });
        $('#field_profile-19').click(function(){
            if(clicked) $('#field_profile-113').trigger('click');
            clicked = false;
        });
    })();


});
