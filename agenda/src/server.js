const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const { url } = require('./config/database');// se coloca entre {url} para decir que el archivo database.js es un objeto y que se quier obtener la url
mongoose.connect(url, {
  useNewUrlParser: true
})

require('./config/passport')(passport);//al archivo passport se le pasa el objeto passport.

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'moises',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //parapasar mensasjes desde distintas paginas html

//routes
require('./app/routes')(app, passport);//al archivo le pasamos dos paramentros el app y el passport para autenticar en las diferentes rutas


//static files
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
  console.log('Servidor en el puerto', app.get('port'));
});
