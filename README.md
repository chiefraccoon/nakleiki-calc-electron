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

## Режим разрботки

Запуск приложения в `dev` окружении. Это запустит рендер в [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) режиме и стартонет webpack dev server:

```bash
$ yarn dev
```

## Сборка приложение

Чтоб собрать приложение запусти команду:

```bash
$ yarn package
```
Собраное приложение располагается в папке `release`.

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)
