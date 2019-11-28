export const EXCHANGE_RATE = 28; // Exchange rate for 1 dollar
export const DEFECTIVE_SHEETS = [
    {"add": 1, "min": 1, "max":30},
    {"add": 2, "min": 30, "max":100},
    {"add": 3, "min": 100, "max":200},
    {"add": 4, "min": 200, "max":500},
    {"add": 5, "min": 500, "max":Infinity},
]; // Листов на брак
export const CUTPRICE_RECT = [
    {"price": 0.12, "min": 1, "max": 20},
    {"price": 0.09, "min": 20, "max": 50},
    {"price": 0.08, "min": 50, "max": 100},
    {"price": 0.07, "min": 100, "max": Infinity}
]; //Цена за порезку прямоугольных наклеек
export const CUTPRICE_SIMPLE_CIRCUIT = [
    {"price": 0.5, "min": 1, "max": 20},
    {"price": 0.45, "min": 20, "max": 50},
    {"price": 0.4, "min": 50, "max": 100},
    {"price": 0.35, "min": 100, "max": Infinity}
]; //Цена за порезку наклеек простой формы
export const CUTPRICE_CUSTOM_CIRCUIT = [
    {"price": 0.9, "min": 1, "max": 20},
    {"price": 0.85, "min": 20, "max": 50},
    {"price": 0.8, "min": 50, "max": 100},
    {"price": 0.7, "min": 100, "max": Infinity}
]; //Цена за порезку наклеек сложной формы
export const BASIS_PRICE = {
    PAPER: 0.11,
    PLASTIC: 0.9
};
export const PROFIT = [
    {"multiplier": 2, "min": 0, "max": 100},
    {"multiplier": 1.9, "min": 100, "max": 200},
    {"multiplier": 1.8, "min": 200, "max": 300},
    {"multiplier": 1.7, "min": 300, "max": 500},
    {"multiplier": 1.6, "min": 500, "max": 700},
    {"multiplier": 1.55, "min": 700, "max": 1000},
    {"multiplier": 1.5, "min": 1000, "max": 1500},
    {"multiplier": 1.45, "min": 1500, "max": 2500},
    {"multiplier": 1.4, "min": 2500, "max": 4500},
    {"multiplier": 1.35, "min": 4500, "max": 10000},
    {"multiplier": 1.3, "min": 10000, "max": 20000},
    {"multiplier": 1.27, "min": 20000, "max": 30000},
    {"multiplier": 1.25, "min": 30000, "max": 50000},
    {"multiplier": 1.23, "min": 50000, "max": Infinity},
];
export const RECT_LIST_PARAMS =  { //list parameters
    width: 310,
    height: 440
};
export const CIRCUIT_LIST_PARAMS = { //list parameters
    width: 280,
    height: 380
};
export const COLORFULL_ARR = [
    {"price": 0.11, "min": 1, "max": 10},
    {"price": 0.09, "min": 10, "max": 750},
    {"price": 0.08, "min": 750, "max": Infinity}
];
export const MONOCHROME_ARR = [
    {"price": 0.06, "min": 1, "max": 100},
    {"price": 0.05, "min": 100, "max": Infinity}
];
export const MIN_STICKER_SIZE = 45;
export const MARGIN_SIZE = 2; // 1mm on each size
export const PRINT_TIME_MULTIPLIER = {
    SUPER_URGENT:  0.3,
    URGENT: 0.2,
    NORMAL: 0
};
export const LAMINATION_PRICE = {
    GLANCE: 0.25,
    MATT: 0.25
}; // lamination per list
export const POSTPRINT_PRICE = 1; // Постпечатная подгодовка
export const MINIMAL_PRICE = {
    CHECK: 111, // Минимальная стоимость ГРН
    ADDITION: 100
};