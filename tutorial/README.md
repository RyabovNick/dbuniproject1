# Tutorial

В первую очередь познакомимся с используемым ПО, ЯП и т.д.:

1. СУБД - [MySql](https://www.mysql.com). В ходе семестра мы будем работать с 2-мя СУБД - Oracle (лидер enterprise сферы) и MySQL (open source продукт). Это строгое требование. [Подробнее](./MySQL)
2. Backend (серверная часть) - [Node.js](https://nodejs.org). Это не строгое требование, но только он будет рассматриваться в курсе. [Подробнее](./NodeJs)
3. Frontend (клиентская часть) - [Vue.js](https://vuejs.org/). Эта часть практически не будет рассматриваться и никаких особых требований в курсе на этот счёт нет. Но нам важно получить какой-то финальный результат. Реально рабочее веб-приложение, чтобы понять на живом примере структуру системы. **Совет:** если вам эта часть реально заинтересовала на изучение, то лучше подойдите/напишите мне, я посоветую с чего начать. [Подробнее](./VueJs)
4. IDE - [VSCode](https://code.visualstudio.com/). Очень удобный бесплатный продукт. Именно им будем пользоваться на парах. Если у вас есть собственные предпочтения, то без проблем - используйте. [Тут даны различные советы](./VScode)
5. [MySQL Workbench](https://dev.mysql.com/downloads/workbench/). Удобный GUI для работы с СУБД MySQL. [Подробнее](MySQLworkbench)

## Step by step

Эта часть требует знакомства с следующим материалом [NodeJs](./NodeJs) и [API](./API)

1. Создайте папку в вашем репозитории с заданиями (можно и в отдельном репозитории - тогда создайте новый и склонируйте его на ПК)
2. Откройте папку в visual studio code.
3. Откроем терминал путём нажатия ctrl+` (или View - Terminal).
4. Напишем в терминале `npm init` ([подробнее](./NodeJs/README.md#npm))
5. Поставим пакеты, которые нам будут необходимы: `npm install express body-parser cors mysql`
    - body-parser позволит доставать данные из POST/PUT запроса
    - cors - Cross-Origin Resource Sharing problem. Можно почитать подробнее самостоятельно
    - mysql - драйвер подключения к серверу mysql
6. Поставим ещё `npm install --save-dev nodemon`. Тут используется флаг, чтобы установить это расширение чисто как средство разработки. Оно будет перезапускать сервер каждый раз, как вы сделали изменения и сохранили. Иначе бы пришлось каждый раз останавливать сервер в ручную и запускать (node server.js -> ctrl+c -> стрелка вверх -> enter)
7. После установки вы сразу увидите (если находитесь в папке, которая является часть .git репозитория), что слева на вкладке source control много новых файлов. Папка `node_modules` содержит кучу зависимостей, нам ни в коем случае не надо отправлять это в репозиторий. Поэтому создайте файл `.gitignore` и добавьте туда строку `node_modules`. Вы скажете git, чтобы он игнорировал эту папку и не следил за ней.

В `package.json` есть `scripts` - туда можно написать собственные скрипты запуска, чтобы запускать их одной командой `npm run <script>`, где `<script>` - название вашего скрипта.

сделаем для удобства скрипт `start`, который будет запускать nodemon:

`"start": "nodemon ./index.js"`

index.js - название основного файла, точка входа. Обычно называются именно таким образом

```json
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "nodemon ./index.js"
    },
```

По сути то, что вы сделали выше - настроили окружение. Ещё на этом этапе нам бы сразу немного продумать как примерно выглядеть будет структура проекта:

-   папка config - с подключением к СУБД
-   папка routes - для удобства написания API

**Примечание:** в примере вы ещё можете увидеть папку `requests` - там находятся примеры запросов через расширения REST Client для vscode. Можете сделать тоже. Или вообще посмотреть и познакомиться с тестированием.

Для удобства проверки заданий вам необходимо создать пользователя в СУБД на [unidb.ru](https://unidb.ru). На свой ПК тоже можете поставить сервер, подключаться уже к нему. Но в сдаче заданий - только так.

`config/config.js`

```js
const mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 1000,
    host: 'unidb.ru',
    port: 3306,
    user: 'your_username',
    password: 'your_password',
    database: 'yor_database'
})

module.exports = pool
```

Создадим pool - набор подключений. Если пользователь запрашивает что-то, что требует
подключения к БД, то берётся одно из готовых в pool соединений и оно используется для подключения, затем освобождается.

-   connectionLimit: максимальное количество соединений
-   host: название сервера
-   port: порт (стандартный mysql)
-   user: пользователь (имя, которое указали при регистрации)
-   password: пароль
-   database: название схемы (совпадает с пользователем)

Мы говорим, что этот набор можно экспортировать, т.е. запросить где-то в другой части программы и использовать

```js
module.exports = pool
```

Итак, создадим `index.js`

```js
//подключаем наши пакеты, установленные ранее
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const cors = require('cors')

var app = express()

//cross-origin requests
app.use(cors())
//для возможности парсить входящий JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//подключим папку routes, чтобы удобнее было работать с различными API (можно и всё в один файл запихать)
app.use(require('./routes'))

//запускаем сервер, который слушает указанный порт
app.listen(8080, () => {
    console.log('server listen 8080')
})

module.exports = router
```

Обратите внимание на пример выше. Мы сказали подтянуть папку `./routes`. Node.js будет искать там файл index.js из которого может пойти дальше.

Поэтому создадим его: `routes/index.js

```js
const router = require('express').Router()

//приставка ко всем ссылкам
router.use('/api', require('./students'))

module.exports = router
```

Все API будут содержаться в файле `students.js`. Тут мы не указывали расширение - соглашение по синтаксису.

Нам надо, чтобы разные части были связаны, поэтому мы подключаем router и экспортируем его.

Создадим файл `students.js`

В нём уже будет собственно API и тут нам надо подключаться к СУБД, поэтому первым делом подключим наш ранее написанный config и router, по аналогии с примером выше.

```js
const pool = require('../config/config')
const router = require('express').Router()

//API will be here

module.exports = router
```

На место комментария мы будем добавлять разные API. Я не буду тут дублировать весь код, только часть. Все в целом виде можно найти в папке [server](../server/routes/students.js)

```js
/**
 * Получение списка студентов
 * Подключаемся к серверу, отправляем запрос
 * список всех студентов
 */
router.get('/students', (req, res, next) => {
    pool.getConnection((err, con) => {
        if (err) throw err

        con.query('Select * from students', (error, result) => {
            if (error) throw error

            res.send(result)
        })
        //Обязательно! Необходимо освободить соединение, иначе через 1000 (сколько указал в config) штук приложение упадёт
        con.release()
    })
})
```

-   get - собственно HTTP метод (get, post, put, delete)
-   req - request - то, что приходит от клиента к серверу
-   res - response - то, что сервер посылает клиенту
-   мы используем подключенную переменную pool и встроенный метод `getConnection`, который возвращает `err` - там будет содержаться сообщение об ошибке, если она возникала и `con` - connection, соединение с сервером.
-   нам нужно используя это соединение выполнить запрос и отправить результат запроса клиенту
-   res.send(result) как раз отправит клиенту ответ
-   в конце необходимо освободить соединение, оно нам больше не нужно

Это простой пример вывода всех данных из таблицы студенты.

Рассмотрим ниже пример с входным параметром

```js
/**
 * получение студентов из заданного города
 */
router.get('/students/city/:city', (req, res, next) => {
    //достать переменную :city из ссылки
    let city = req.params['city']

    pool.getConnection((err, con) => {
        if (err) throw err

        // ? - экранирует код в '' кавычках
        // ?? - экранирует код в `` кавычках
        // это необходимо, чтобы не быть уязвимым к sql инъекциям
        con.query('Select * from students where city = ?', city, (error, result) => {
            if (error) throw error

            res.send(result)
        })
        con.release()
    })
})
```

-   :city - это входной параметр
-   который мы достаём `let city = req.params['city']` таким образом
-   `con.query('Select * from students where city = ?', city, (error, result)` запрос тоже отличается, мы используем экранирование встроенными методами, чтобы избежать SQL инъекций: ? добавляет ' такую кавычку, ?? добавляет ` такую

Ещё один пример:

```js
/**
 * Получение студента с заданным номером зачётки
 */
router.get('/students/:n_z', (req, res, next) => {
    //достать переменную :city из ссылки
    var n_z = req.params['n_z']

    pool.getConnection((err, con) => {
        if (err) throw err

        // ? - экранирует код в '' кавычках
        // ?? - экранирует код в `` кавычках
        // это необходимо, чтобы не быть уязвимым к sql инъекциям
        con.query('Select * from students where n_z = ?', n_z, (error, result) => {
            if (error) throw error

            res.send(result)
        })
        con.release()
    })
})
```

Пример POST запроса:

```js
/**
 * такая же ссылка, как мы делали раньше, но сейчас метод - POST
 */
router.post('/students', (req, res, next) => {
    pool.getConnection((err, con) => {
        if (err) throw err

        //получаем параметры из JSON
        let name = req.body.name
        let surname = req.body.surname
        let date_birth = req.body.date_birth
        let n_group = req.body.n_group
        let score = req.body.score
        let city = req.body.city
        let address = req.body.address

        // ? - экранирует код в '' кавычках
        // ?? - экранирует код в `` кавычках
        // это необходимо, чтобы не быть уязвимым к sql инъекциям
        con.query(
            'INSERT INTO `students`(`name`,`surname`,`date_birth`,`n_group`,`score`,`city`,`address`) VALUES (?,?,?,?,?,?,?)',
            [name, surname, date_birth, n_group, score, city, address],
            (error, result) => {
                if (error) throw error

                res.setHeader('Content-Type', 'application/json')
                res.send(result)
            }
        )
        con.release()
    })
})
```

**POST, PUT, DELETE запросы не получится выполнить просто в браузере.**

Используйте для этого расширение REST Client в vscode или установите дома [POSTMAN](https://www.getpostman.com/)

POST ждёт данные в JSON формате

`let name = req.body.name`

для того, чтобы таким образом достать значение из JSON и используется `body-parser`.

Дальше всё не сильно отличается от GET. Мы просто используем `INSERT` и добавляем данные в таблицу.

```js
/**
 * ссылка с параметром (n_z), т.е. мы меняем данные у конкретного студента
 */
router.put('/students/:n_z', (req, res, next) => {
    pool.getConnection((err, con) => {
        if (err) throw err

        //получаем номер зачётки из ссылки
        let n_z = req.params['n_z']
        //получаем параметры из JSON
        let name = req.body.name
        let surname = req.body.surname
        let date_birth = req.body.date_birth
        let n_group = req.body.n_group
        let score = req.body.score
        let city = req.body.city
        let address = req.body.address

        // ? - экранирует код в '' кавычках
        // ?? - экранирует код в `` кавычках
        // это необходимо, чтобы не быть уязвимым к sql инъекциям
        // в обновлении есть важный нюанс, если мы не передадим все параметры, то будет имеющееся значение заменено на null
        // поэтому проверим, если введённое null, то заменим данные на то, что уже есть в таблице (name = name)
        con.query(
            'UPDATE `students` SET `name` = IFNULL(?, name),`surname` = IFNULL(?,surname),`date_birth` = IFNULL(?,date_birth)' +
                ',`n_group` = IFNULL(?,n_group),`score` = IFNULL(?,score),`city` = IFNULL(?,city),`address` = IFNULL(?,address) WHERE `n_z` = ?',
            [name, surname, date_birth, n_group, score, city, address, n_z],
            (error, result) => {
                if (error) throw error

                res.setHeader('Content-Type', 'application/json')
                res.send(result)
            }
        )
        con.release()
    })
})
```

В PUT запросе кроме того, что он получает JSON, ещё и используется параметр в ссылке. Мы меняем элемент с заданным id (n_z в данном случае)

```js
/**
 * Удаление студента с заданным номером зачётки
 */
router.delete('/students/:n_z', (req, res, next) => {
    //достать переменную :city из ссылки
    let n_z = req.params['n_z']

    pool.getConnection((err, con) => {
        if (err) throw err

        // ? - экранирует код в '' кавычках
        // ?? - экранирует код в `` кавычках
        // это необходимо, чтобы не быть уязвимым к sql инъекциям
        con.query('Delete from `students` where n_z = ?', n_z, (error, result) => {
            if (error) throw error

            res.send(result)
        })
        con.release()
    })
})
```

В delete используется только параметр в ссылке.

После этой части у вас должен быть рабочий сервер с 6 API. 3 из них возвращают результат запроса и также есть возможность добавить, удалить и изменить данные в таблице.
