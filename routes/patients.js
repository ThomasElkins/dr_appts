var express = require('express');
var router = express.Router();
var knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    database : 'medical_network'
  }
});

//Patients Home Page
router.get('/', function(req, res, next) {
  knex.raw(`select * from patientsTable`)
    .then(function(data){
      res.render('patients/allPatients', {title: 'Patients', data: data.rows})
    });
});

// Create new patient page\
router.get('/new', function(req, res, next){
      res.render('patients/newPatient', {title: 'Add new Patient to Directory'})
    });

// Post new patient to database
router.post('/new', function(req, res, next){
  knex.raw(`insert into patientsTable (name, age, gender, height) values ('${req.body.name}', '${req.body.age}',
                                                                          '${req.body.gender}', '${req.body.height}')`)
          .then(function(){
            // var patientID = req.params.id;
            res.redirect('/patients/')
          });
});

// Edit patient Info Page
router.get('/:id/edit', function(req, res, next){
  var patientID = req.params.id;
  res.render('patients/editPatient', {title: 'Edit Patient Information', patientID: patientID});
});

// Delete Patient Info
router.post('/:id/delete', function(req, res, next){
  var patientID = req.params.id;
  knex.raw(`delete from patientsTable where id = ${patientID}`)
  .then(function(data){
    res.redirect('/patients');
  });
});

// Update Patient Info
router.post('/:id/edit', function(req, res, next){
  var patientID = req.params.id;
    knex.raw(`update patientsTable set name = '${req.body.name}', age = '${req.body.age}',
                                       gender = '${req.body.gender}', height = '${req.body.height}' where id = ${patientID}`)
        .then(function(){
          res.redirect(`/patients/${patientID}`)
        });

});

//Individual Patients page
router.get('/:id', function(req, res, next){
  var patientID = req.params.id;
  knex.raw(`select * from patientsTable where patientsTable.id = ${patientID}`)
    .then(function(data){
      res.render('patients/singlePatient', {data: data.rows[0], patientID: patientID})
    });
});



module.exports = router;
