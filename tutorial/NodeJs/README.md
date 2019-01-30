# Node.js

Кросс-платформенная с открытым исходным кодом среда выполнения JavaScript, которая запускает JS код вне браузера. Ранее JS выполнялся только для клиентской части, Node.js позволяет выполнять Js код и для серверной.

Имеет архитектуру, управляемую событиями, способную к асинхронному вводу/выводу (I/O). Создавался с целью оптимизации пропускной способности и масштабируемости в веб-приложениях с множеством операций I/O.

[Скачайте и поставьте последнюю рекомендованную версию](https://nodejs.org)

На данный момент это версия 10.x. Кстати 10 версия node.js носит кодовое имя - Dubnium

Node.js сам по себе очень легковесный. Это такой подход - предоставлять мало возможностей, но если надо разработчик может подключить различные библиотеки из менеджера пакетов (npm) и поделиться там же своими пакетами.

# npm

Напишем в терминала `npm init`

Дальше будет задано несколько вопросов, на все можно пока тыкать enter.
До самого конца

```
package name: (nodeapi)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to D:\Projects\unidubnadb\API\NodeAPI\package.json:
```

```json
{
  "name": "nodeapi",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this ok? (yes)
```

У вас появился файл package.json в котором содержится вся информация о проекте.

Как отмечалось раньше, мы будем использовать различные пакеты. Чтобы установить какой-либо нужно использовать команду `npm install`

В первую очередь нужно поставить `express`

Очень популярный высокоуровневый фреймворк.

В подавляющем большинстве случае используется либо он, либо какой-то аналог.
Делать API на чистом NodeJs придётся маловерятно, поэтому этого не будем делать и мы.

`npm install express`

В итоге появится папка node_modules.

**Важно!!!**

**В систему контроля версий эта папка никогда не кладётся.
Она может весить много, множество файлов.
Если вы скачали какой-то проект, где есть package.json, то первым в терминале напишите `npm install`.
Все зависимости будут скачаны с npm сервера.**

## Пример сервера с минимальным функционалом

Создадим файлик server.js

```js
const express = require('express')
const app = express()

app.listen(8080, () => {
    console.log('Server started!')
})
```

Его можно запустить из терминала при помощи команды `node server.js` (если в терминале находитесь в той же папке, что и файл)

Сервер ничего особенного не делает, просто напишет в терминале сообщение Server started!

Тут мы подключили наш установленный express. Создали приложение и сказали ему слушать порт 8080

```js
;() => {
    console.log('Server started!')
}
```

Вот эта запись называется arrow function, или стрелочная функция. По сути сокращение от следующей записи:

```js
function() {
    console.log('Server started!')
}
```

Двигаемся дальше

```js
const express = require('express')
const app = express()

app.route('/').get((req, res) => {
    res.send('Hi everyone!')
})

app.listen(8080, () => {
    console.log('Server started!')
})
```

**Что происходит в коде?**

Мы добавили часть, где говорим, что по пути '/', если это get запрос мы хотим вернуть сообщение Hi everyone.

Перейдите в браузере по ссылке `localhost:8080` вы должны увидеть сообщение, которые мы написали `Hi everyone!`

Мы хотим, чтобы сервер приветствовал каждую группу.

```js
const express = require('express')
const app = express()

app.route('/2221').get((req, res) => {
    res.send('Hi group: 2221')
})

app.listen(8080, () => {
    console.log('Server started!')
})
```

Окей, он попривествовал группу 2221. Давайте добавим ещё одну.

```js
const express = require('express')
const app = express()

app.route('/2221').get((req, res) => {
    res.send('Hi group: 2221')
})

app.route('/2281').get((req, res) => {
    res.send('Hi group: 2281')
})

app.listen(8080, () => {
    console.log('Server started!')
})
```

А если групп тысяча? Как-то не очень удобно.

Есть другой вариант!

```js
const express = require('express')
const app = express()

app.route('/:group').get((req, res) => {
    var group = req.params['group']
    res.send('Hi group: ' + group)
})

app.listen(8080, () => {
    console.log('Server started!')
})
```

**Что происходит в коде?**

В код добавлено "/:group" и если мы перейдём по ссылке http://localhost:8080/:group сервер нам вернёт Hi group: :group.

`:group` - такая запись для параметров.
Дальше в коде мы в переменную group кладём этот параметр и выводим его на экран. Параметров может быть сколько угодно.

Поэксперементируйте. Введите свой номер группы.
