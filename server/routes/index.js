var router = require('express').Router()

//приставка ко всем ссылкам
router.use('/api', require('./students'))

/*router.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce(function(errors, key) {
                errors[key] = err.errors[key].message

                return errors
            }, {})
        })
    }

    return next(err)
})*/

module.exports = router
