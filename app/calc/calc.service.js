import {
    EXCHANGE_RATE,
    BASIS_PRICE,
    CUTPRICE_CUSTOM_CIRCUIT,
    CUTPRICE_RECT,
    CUTPRICE_SIMPLE_CIRCUIT,
    DEFECTIVE_SHEETS,
    LAMINATION_PRICE,
    PROFIT,
    RECT_LIST_PARAMS,
    CIRCUIT_LIST_PARAMS,
    COLORFULL_ARR,
    MONOCHROME_ARR,
    MIN_STICKER_SIZE,
    MARGIN_SIZE,
    PRINT_TIME_MULTIPLIER,
    POSTPRINT_PRICE,
    MINIMAL_PRICE
} from '../admin/admin.constants';
import {FORM, TYPE, BASIS, LAMINATION, PRINT_TIME} from '../client/client.constants';

export function calculateTotal({type, form, stickerWidth, stickerHeight, quantity, basis, lamination, printTime}) {
    let totalPrice, totalPriceUAH, totalPriceProfitUAH, totalPriceComUAH;
    let stickersOnList = calculateStickersOnList({stickerWidth, stickerHeight, form}),
        requiredListsAmount = calculateRequiredListsAmount({quantity, stickersOnList});

    totalPrice = calculatePrintPrice({requiredListsAmount, type}) +
        calculateCutPrice({form, stickerWidth, stickerHeight, requiredListsAmount}) +
        calculateBasisPrice({requiredListsAmount, basis}) +
        POSTPRINT_PRICE;

    totalPrice += calculateLamination({lamination, requiredListsAmount});
    totalPrice += calculatePriceUrgency({price: totalPrice, printTime});

    totalPriceUAH = totalPrice * EXCHANGE_RATE;
    totalPriceProfitUAH = addProfit(totalPriceUAH);
    totalPriceComUAH = totalPriceProfitUAH + ((totalPriceProfitUAH / 100) * 3); // Оставил так как было в примере, уточнить надо ли?

    if (isNaN(totalPriceComUAH) || totalPriceComUAH == Number.POSITIVE_INFINITY || totalPriceComUAH == Number.NEGATIVE_INFINITY) totalPriceComUAH = 0;

    return totalPriceComUAH.toFixed(2)
}

//Функция добавления стоимости за срочность заказа
function calculatePriceUrgency({price, printTime}) {
    if (printTime === PRINT_TIME.SUPER_URGENT) {
        return price * PRINT_TIME_MULTIPLIER.SUPER_URGENT;
    } else if (printTime === PRINT_TIME.URGENT) {
        return price * PRINT_TIME_MULTIPLIER.URGENT;
    } else {
        return price * PRINT_TIME_MULTIPLIER.NORMAL;
    }
}

// Функция добавления наценки
function addProfit(priceUAH) {
    if (priceUAH) {
        priceUAH = parseFloat(priceUAH.toFixed(2));
    }

    if (priceUAH <= MINIMAL_PRICE.CHECK) {
        return priceUAH + MINIMAL_PRICE.ADDITION;
    } else {
        return priceUAH * PROFIT.find(findRange(priceUAH)).multiplier;
    }
}

//Функция расчета стоимости ламинации
function calculateLamination({lamination, requiredListsAmount}) {
    if (lamination === LAMINATION.GLANCE) {
        return requiredListsAmount * LAMINATION_PRICE.GLANCE;
    } else if (lamination === LAMINATION.MATT) {
        return requiredListsAmount * LAMINATION_PRICE.MATT;
    } else return 0;
}

function calculateRequiredListsAmount({quantity, stickersOnList}) {
    let calculatedListsAmount = Math.ceil(parseInt(quantity) / stickersOnList);

    //добавим ещё дополнительные листы на брак
    return calculatedListsAmount + DEFECTIVE_SHEETS.find(findRange(calculatedListsAmount)).add;
}

//Функция расчета цены печати
function calculatePrintPrice({requiredListsAmount, type}) {
    let PRINT_PRICE_LIST;

    if (type === TYPE.COLORFULL) {
        PRINT_PRICE_LIST = COLORFULL_ARR;
    } else if (type === TYPE.MONOCHROME) {
        PRINT_PRICE_LIST = MONOCHROME_ARR;
    } else {
        throw 'Unknown print type';
    }
    return requiredListsAmount * PRINT_PRICE_LIST.find(findRange(requiredListsAmount)).price;
}

// Функция расчета стоимости порезки
function calculateCutPrice({form, stickerWidth, stickerHeight, requiredListsAmount}) {
    let CUT_PRICE_LIST;
    if (stickerWidth < MIN_STICKER_SIZE || stickerHeight < MIN_STICKER_SIZE) {
        switch (form) {
            case FORM.RECT:
            case FORM.CIRCLE:
                CUT_PRICE_LIST = CUTPRICE_SIMPLE_CIRCUIT;
                break;
            case FORM.CUSTOM:
                CUT_PRICE_LIST = CUTPRICE_CUSTOM_CIRCUIT;
                break;
        }
    } else {
        switch (form) {
            case FORM.RECT:
                CUT_PRICE_LIST = CUTPRICE_RECT;
                break;
            case FORM.CIRCLE:
                CUT_PRICE_LIST = CUTPRICE_SIMPLE_CIRCUIT;
                break;
            case FORM.CUSTOM:
                CUT_PRICE_LIST = CUTPRICE_CUSTOM_CIRCUIT;
                break;
        }
    }

    return requiredListsAmount * CUT_PRICE_LIST.find(findRange(requiredListsAmount)).price;
}

// Функция расчета цены основы
function calculateBasisPrice({requiredListsAmount, basis}) {
    switch (basis) {
        case BASIS.PAPER:
            return requiredListsAmount * BASIS_PRICE.PAPER;
        case BASIS.PLASTIC:
            return requiredListsAmount * BASIS_PRICE.PLASTIC;
    }
}

// Функция расчета количества наклеек, помещаемых в лист
function calculateStickersOnList({stickerWidth, stickerHeight, form}) {
    if (!stickerWidth || !stickerHeight) {
        return;
    }
    let LIST_FIGURE;

    if (stickerWidth < MIN_STICKER_SIZE || stickerHeight < MIN_STICKER_SIZE) {
        LIST_FIGURE = CIRCUIT_LIST_PARAMS;
    } else {
        switch (form) {
            case FORM.RECT:
                LIST_FIGURE = RECT_LIST_PARAMS;
                break;
            case FORM.CIRCLE:
            case FORM.CUSTOM:
            default:
                LIST_FIGURE = CIRCUIT_LIST_PARAMS;
                break;
        }
    }
    return calculateFigures(LIST_FIGURE, {
        width: stickerWidth,
        height: stickerHeight
    });
}

/**
 * Count an amount of how many stickers can be placed on one paper
 * @param FigureA - object containing width and height of paper
 * @param Sticker - user defined sticker width and height
 * @returns {number} - max number of stickers placed on a paper
 */
function calculateFigures(FigureA, Sticker) {
    var total1 = 0,
        total2 = 0,
        FigureB = {};

    FigureB.width = parseInt(Sticker.width) + MARGIN_SIZE;
    FigureB.height = parseInt(Sticker.height) + MARGIN_SIZE;


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

function findRange(number) {
    return obj => number >= obj.min && number <= obj.max;
}

const test = {
    "results": [
        173.37,
        161.26,
        400.76,
        462.22,
        173.37,

    ],
    "data": [
        {
            type: TYPE.COLORFULL,
            form: FORM.RECT,
            stickerWidth: 40,
            stickerHeight: '40',
            quantity: 1,
            basis: BASIS.PAPER,
            lamination: undefined,
            printTime: PRINT_TIME.NORMAL
        },
        {
            type: TYPE.COLORFULL,
            form: FORM.RECT,
            stickerWidth: 200,
            stickerHeight: '100',
            quantity: 10,
            basis: BASIS.PAPER,
            lamination: undefined,
            printTime: PRINT_TIME.NORMAL
        },
        {
            type: TYPE.COLORFULL,
            form: FORM.CUSTOM,
            stickerWidth: 200,
            stickerHeight: '150',
            quantity: 10,
            basis: BASIS.PAPER,
            lamination: undefined,
            printTime: PRINT_TIME.NORMAL
        },
        {
            type: TYPE.MONOCHROME,
            form: FORM.CUSTOM,
            stickerWidth: 200,
            stickerHeight: '150',
            quantity: 10,
            basis: BASIS.PAPER,
            lamination: undefined,
            printTime: PRINT_TIME.URGENT
        },
        {
            type: TYPE.COLORFULL,
            form: FORM.RECT,
            stickerWidth: 40,
            stickerHeight: '40',
            quantity: 10,
            basis: BASIS.PAPER,
            lamination: undefined,
            printTime: PRINT_TIME.NORMAL
        }
    ]
};
/*
const testResult = test.data.map( item => calculateTotal(item));

testResult.map( (resultItem, index) => console.log(resultItem, test.results[index],resultItem == test.results[index]));*/

