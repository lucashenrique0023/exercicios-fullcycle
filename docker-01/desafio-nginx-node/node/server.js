const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'testdb'
});

connection.connect();

app.get('/', (req, res) => {
  const person = { name: 'fullcycle' + Math.random() }; // Nome da pessoa a ser inserida

  connection.query('INSERT INTO people SET ?', person, (error, result) => {

    connection.query('SELECT * FROM people', (error, results) => {
	let responseText = '<h1>Full Cycle Works!</h1>\n\n';
	results.forEach(row => {
		responseText += row.name + '\n';
	});

      res.send(`<pre>${responseText}</pre>`);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
