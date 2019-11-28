<p>
  Nakleiki Calculator primer uses <a href="http://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="http://webpack.github.io/docs/">Webpack</a> for rapid application development (HMR).
</p>


## Install

Сначала, склонируй репо:

```bash
git clone --depth 1 --single-branch --branch master git@github.com:chiefraccoon/nakleiki-calc-electron.git your-project-name
```

И дальше установи зависимости используя yarn.

```bash
$ cd your-project-name
$ yarn
```

## Что смотреть
Весь код калькулятора расположен в файле [app/calc/calc.service.js](https://github.com/chiefraccoon/nakleiki-calc-electron/blob/master/app/calc/calc.service.js),
основной метод - `calculateTotal`

Также используются константы:
- [app/admin/admin.constants.js](https://github.com/chiefraccoon/nakleiki-calc-electron/blob/master/app/admin/admin.constants.js)
- [app/client/client.constants.js](https://github.com/chiefraccoon/nakleiki-calc-electron/blob/master/app/client/client.constants.js)

## Режим разработки

Запуск приложения в `dev` окружении. Это запустит рендер в [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) режиме и стартонет webpack dev server:

```bash
$ yarn dev
```

## Сборка приложения

Чтоб собрать приложение запусти команду:

```bash
$ yarn package
```
Собраное приложение располагается в папке `release`.

## TODO
 - Перенести логику калькулятора на вебсайт
 - Добавить валидацию на форму калькулятора
 - - ...
 - Добавить в админке поля для ввода значений цен и параметров калькулятора
 - - ...
 - ?Нужно ли скрывать логику расчета цен? - рассмотреть вариант расчета на беке через API
