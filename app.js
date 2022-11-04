var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const headerFunc = require('./modules/middlewares/header')
const axios = require('axios')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function toRupiah(num) {
  const d = new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR"}).format(2000);
    return d
}

app.use('/',headerFunc,  indexRouter);
app.use('/users', usersRouter);
app.get('/products', async (req, res, next) => {
  try {
    const response = await axios.get("https://dummyjson.com/products")
  const products = response.data.products
    let results = []
    products.forEach((v, i) => {
      results.push({
        id: v.id,
        title: v.title,
        description: v.title,
        price: toRupiah(v.price),
      })
    })

    res.status(200).json({
      data: results
    })
  }catch(err){
    res.json(500)
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
