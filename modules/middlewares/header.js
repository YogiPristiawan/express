const headerFunc = (req, res, next) => {
 const user = req.headers.user
 if (!user) {
    res.status(403).json({
        message:"required header user"
    })
 }

 if (user != 'budi') {
    res.status(403).json({
        message:"harus budi"
    })
 }

 next()
}

module.exports = headerFunc