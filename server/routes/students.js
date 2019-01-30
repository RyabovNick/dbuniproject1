const pool = require('../config/config')
const router = require('express').Router()

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
        //Обязательно! Необходимо освободить соединение, иначе через 100 штук приложение упадёт
        con.release()
    })
})

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

module.exports = router
