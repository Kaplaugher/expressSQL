var express = require('express');
var router = express.Router();
// Import config.js from the config directory. It holds our SQL creds
var config = require('../config/config');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

// After this line runs, we are connected to MySQL!
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {

	//Init array as a placeholder
	// var taskArray = [];

	var selectQuery = "SELECT * FROM tasks";

	connection.query(selectQuery, (error, results, field)=>{
		// res.json(results);
		res.render('index', { taskArray: results });
	})
});

router.post('/addNew', (req, res, next)=>{
	// res.json(req.body);
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;
// We have a MySQL conncetion... called connection!
	var insertQuery = "INSERT INTO tasks (task_name, task_date) VALUES ('"+newTask+"','"+taskDate+"')";

	// res.send(insertQuery);

	connection.query(insertQuery, (error, results, field)=>{
		if (error) throw error;
		res.redirect('/');
	});
});

/////////////EDIT GET//////////////////
router.get('/edit/:id', (req, res, next)=>{
	// res.send(req.params.id);
	var selectQuery = "SELECT * FROM tasks WHERE id ="+req.params.id;
	// res.send(selectQuery);
	connection.query(selectQuery, (error,results,fields)=>{
		// res.json(results);
		// var date = results[0].task_date;
		var days = results[0].task_date.getDate();
		if(days < 10){
			days = "0"+days;
		}
		var months = results[0].task_date.getMonth() + 1;
		if(months < 10){
			months = "0"+months;
		}
		var years = results[0].task_date.getFullYear();
		var mysqlDate = years + '-' + months + '-' + days;
		results[0].task_date = mysqlDate;
		// res.json(date);
		res.render('edit', { task:results[0] } );
	})
});

/////////////EDIT POST//////////////////
router.post('/edit/:id', (req, res, next)=>{
	// id is in the req.params
	var id = req.params.id
	// res.send(req.params.id);
	// task_name and task_date are in req.body
	var newTask = req.body.newTaskString;
	var taskDate = req.body.newTaskDate;

	var updateQuery = "UPDATE tasks SET task_name='"+newTask+"', task_date='"+taskDate+"' WHERE ID = "+id;
	res.send(updateQuery);
});

/////////////DELETE GET//////////////////
router.get('/delete/:id', (req, res, next)=>{
	var selectQuery = "SELECT * FROM tasks WHERE id ="+req.params.id;
	// res.send(req.params.id);
});

/////////////DELETE POST//////////////////
router.post('/delete/:id', (req, res, next)=>{
	res.send(req.params.id);
});

module.exports = router;
