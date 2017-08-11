var express = require('express');
var router = express.Router();
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    database : 'medical_network'
  }
});

//Doctors Home Page
router.get('/', function(req, res, next) {
  knex.raw(`select * from doctorsTable`)
    .then(function(data){
      res.render('doctors/allDoctors', {data: data.rows})
    });
});

// Create new Doctor page
router.get('/new', function(req, res, next){
      res.render('doctors/newDoctor', {title: "Add Doctor to Database"})
    });

// Post new Doctor to database
router.post('/new', function(req, res, next){
    knex.raw(`insert into doctorsTable (name, age, gender, hospital_id) values ('${req.body.name}', '${req.body.age}',
                                                              '${req.body.gender}', '${req.body.hospitalID}')`)
      .then(function(data){
        res.redirect('/doctors')
      });
});

// Edit Doctor Info Page
router.get('/:id/edit', function(req, res, next){
  var doctorID = req.params.id;
  res.render('doctors/editDoctor', {title: 'Edit Doctor Information', doctorID: doctorID});
});

// Delete Doctor Info
router.post('/:id/delete', function(req, res, next){
  var doctorID = req.params.id;
  knex.raw(`delete from doctorsTable where id = ${doctorID}`)
  .then(function(data){
    res.redirect('/doctors');
  });
});

// Update Doctor Info
router.post('/:id/edit', function(req, res, next){
  var doctorID = req.params.id;
  knex.raw(`update doctorsTable set name = '${req.body.name}', age = '${req.body.age}', gender = '${req.body.gender}',
                                      hospital_id = '${req.body.hospitalID}' where id = ${doctorID}`)
      .then(function(){
        res.redirect(`/doctors/${doctorID}`)
      });
});

//Individual Doctors page
router.get('/:id', function(req, res, next){
  var doctorID = req.params.id;
  knex.raw(`select * from doctorsTable where id = ${doctorID}`)
    .then(function(data){
      res.render('doctors/singleDoctor', {data: data.rows[0], doctorID: doctorID})
    });
});



module.exports = router;
