var createError = require('http-errors');
var express = require('express');
var multer =require('multer')
var path = require('path');
var cookieParser = require('cookie-parser');
const dotenv=require('dotenv')
dotenv.config({path:"config/config.env"})
const axios = require('axios');
var indexRouter = require('./routes/index');
var registerRoute = require('./routes/register');
var loginRoute = require('./routes/login');
var logoutRoute = require('./routes/logout');
var dashBoardRoute = require('./routes/dashBoard.js');
var editRoute = require('./routes/edit');
var sellRoute = require('./routes/sell');
var cartRoute = require('./routes/cart');
var cartItemRoute = require('./routes/cartItem');
var productRoute = require('./routes/product');
var productRecycleRoute = require('./routes/productRecycle');
var checkoutRouter=require('./routes/checkout');
var messageRoute=require('./routes/message')
var orderRouter=require('./routes/order')
var bootRouter=require('./controller/chatboot')
var shippingFormRouter=require('./routes/shippingForm')
var contactRoute=require('./routes/contact')
var app = express();
var isauth=require('./routes/isauth');
var debug = require('debug')('e-wastecare:server');
var http = require('http');

const connectDb = require('./config/connectDb');
connectDb();
var port =(process.env.PORT || '4000');
app.set('port', port);


var server = http.createServer(app);
 server.listen(port, () => {
  keepAlive();
  console.log(`Server running on port ${port}`);

});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({limit:'50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img')
  },
  filename: function (req, file, cb) {
 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix+'-'+ file.originalname )
  }
})
const upload = multer({ storage: storage })

app.use('/',indexRouter);
app.use('/registerUser',registerRoute);
app.use('/loginUser',loginRoute);
app.use('/logout',logoutRoute);
app.use('/dashBoard',isauth,dashBoardRoute);
app.use('/shippingForm',isauth,shippingFormRouter);
app.get('/login',function(req,res){
  res.render('login',{message:""})
});
app.get('/shipping',function(req,res){
  res.render('shippingInfo')
});
app.use('/editProfile',isauth,editRoute);
app.use('/order',isauth,orderRouter);
app.use('/sell',upload.single('image'),sellRoute);
app.get('/edit',function(req,res){
  res.render('editProfile')
});
app.get('/chatroom',function(req,res){
  res.render('chatroom')
});
app.get('/ch',function(req,res){
  res.render('ch')
});
function keepAlive() {
  const url = `https://e-wastecare.onrender.com/product`;
  setInterval(async () => {
    try {
      await axios.get(url);
    
    } catch (error) {
      console.error('Error pinging the server:', error);
    }
  },60*10*1000); 
}
app.get('/register',function(req,res){
  res.render('registers')
});
app.use('/conform',isauth,function(req,res){
  res.render('conform')
});
app.get('/Quiz',function(req,res){
  res.render('Quiz')
});
app.use('/sellProduct',isauth,(req,res)=>{
  res.render('sellProduct')
}
);
app.use('/addToCart',isauth ,cartRoute
);
app.use('/cart',isauth,cartItemRoute
);
app.use('/product',productRoute);
app.use('/message',messageRoute);
app.use('/bot',bootRouter);
app.use('/productRecycle',productRecycleRoute);

app.get('/blog',function(req,res){
  res.render('blog')
});

app.use('/contact',contactRoute);
app.get('/chatboot',function(req,res){
  res.render('chatboot')
});
app.use('/checkout',isauth,checkoutRouter);

app.get('/about',function(req,res){
  res.render('about')
});

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
