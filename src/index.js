const express = require("express");
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');

//Inicializar
const app = express();
require('./lib/passport')

//COnfiguracion
app.set('port',process.env.PORT || 4000)
app.set('views', path.join(__dirname,'views'))
app.engine('.hbs', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js')
}));
app.set('view engine', '.hbs')

//Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'lmsproyect',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(flash());
//Variables globales
app.use((req,res,next)=>{
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user
    next();
});

app.use(passport.initialize());
app.use(passport.session());

//Rutas
app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use('/links',require('./routes/links'));

//Publico
app.use(express.static(path.join(__dirname,'public')));


//Starting the server
app.listen(app.get('port'), () => {
    console.log('server on port: ', app.get('port'))
});

