const Evento = require('./models/events');
module.exports = (app, passport) => {//app y express ya se configuraron en el server
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.post('/', (req, res) => {

  });

  app.get('/login', (req, res) => {
    res.render('indexx', {
      message: req.flash('LoginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {//utiliza la logica de passport.js llamado local-login
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', (req, res) => {
    res.render('signup', {
      message: req.flash('SignupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {//authenticate es un metodo de passport para comparar datos.
    successRedirect: '/main',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/main', isLoggedIn, (req, res) => {//con isLoggedIn controla si esta autenticado continua a renderizar caso contrario redirecciona al home
    res.render('main', {//la vista profile obtiene un objeto que passport proporciona llamado user que lo recibimos a traves del objeto request (req).
      user: req.user//este eobjeto se envia al front para renderizar los datos del usuario
    })
  })

  //para cerrar sesion
  app.get('/logout', (req, res) => {
    req.logout(); //logout es un metodo que nos proporciona passport a traves del objeto request.
    res.redirect('/');
  })

  //para controlar si alguien intenta ingresar directamente a la ruta de perfil (/profile) sin autenticarse
  function isLoggedIn(req, res, next) {//esta funcion la pasamos a la peticion de la ruta /profile
    if (req.isAuthenticated()) {//Si desde la peticion req hay un metodo de passport isAuthenticated entonces continua renderizando la ruta
      return next();
    }
    return res.redirect('/');
  }

  //cargado contenido
  app.get('/main/all', (req, res) => {
    Evento.find({}).exec(function(err, docs) {
        if (err) {
            res.status(500)
            res.json(err)
        }
        res.json(docs)
    })
  });

  app.post('/main/new', (req, res) => {
    let newEvent = new Evento({
        userId: Math.floor(Math.random() * 1000),
        start: req.body.start,
        title: req.body.title,
        end: req.body.end
    })
    newEvent.save(function(error) {
        if (error) {
            res.status(500);
            res.json(error);
        }
        res.send("Evento guardado")
    })
})


  app.post('/main/update/:eventId', (req, res) => {
    let eid = req.params.eventId;
    Evento.update({_id: eid}, {$set: { start: req.body.start,  end: req.body.end} }, function(error) {
        if(error) {
            res.status(500)
            res.json(error)
        }
        res.send("Registro actualizado " + req.params.eventId);
      })
  });


  app.post('/main/all/delete/:eventId', function(req, res) {
    let eid = req.params.eventId;
    Evento.deleteOne({_id: eid}, function(error) {
        if(error) {
            res.status(500)
            res.json(error)
        }
        res.send("Registro eliminado " + req.params.eventId)
    })
  })

}
