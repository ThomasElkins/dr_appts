var express = require('express');
var router = express.Router();
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    database : 'medical_network'
  }
});

//Hospitals Home Page
router.get('/', function(req, res, next) {
  knex.raw(`select * from hospitalsTable`)
    .then(function(data){
      res.render('hospitals/allHospitals', {data: data.rows})
    });
});

// Create new hospital page\
router.get('/new', function(req, res, next){
      res.render('hospitals/newHospital', {title: "Add Hospital to Database"})
    });

// Post new hospital to database
router.post('/new', function(req, res, next){
  knex.raw(`insert into hospitalsTable (name, location) values ('${req.body.name}', '${req.body.location}')`)
    .then(function(data){
      res.redirect('/hospitals')
    });
});

// Edit Hospital Info Page
router.get('/:id/edit', function(req, res, next){
  var hospitalID = req.params.id;
  res.render('hospitals/editHospital', {title: 'Edit Hospital Information', hospitalID: hospitalID});
});

// Delete Hospital Info
router.post('/:id/delete', function(req, res, next){
  var hospitalID = req.params.id;
  knex.raw(`delete from hospitalsTable where id = ${hospitalID}`)
  .then(function(data){
    res.redirect('/hospitals');
  });
});

// Update Hospital Info
router.post('/:id/edit', function(req, res, next){
    var hospitalID = req.params.id;
    knex.raw(`update hospitalsTable set name = '${req.body.name}', location = '${req.body.location}' where id = ${hospitalID}`)
    .then(function(){
      res.redirect('/hospitals')
    });
});

//Individual Hospital page
router.get('/:id', function(req, res, next){
  var hospitalID = req.params.id;
  knex.raw(`select * from hospitalsTable where id = ${hospitalID}`)
    .then(function(data){
      res.render('hospitals/singleHospital', {data: data.rows[0], hospitalID: hospitalID})
    });
});



module.exports = router;
