const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');


const { Pool } = require('pg');
const fs = require('fs');
const app = express();
require('dotenv').config();

app.use(cors({
	origin: '*'
}));


const PORT = process.env.PORT || 3333
// app.listen(PORT)

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL
})


app.post("/create_employee",bodyParser.json() ,async (req,res)=> {
    try {
        const name = req.body.name
        const role = req.body.role

        const employee = await pool.query('INSERT INTO employee ("name", "role") values ($1, $2) returning employee_id',[name, role])
        console.log(employee.rows[0].employee_id)
        return res.status(200).send("inserted with id: " + employee.rows[0].employee_id) 
    } catch(err) {
        console.log(err)
        return res.status(400).send(err)
    }
})

app.get("/read_employee/:name", bodyParser.json(), async (req,res) => {
    const { name } = req.params
    try{
        // let query = `SELECT * FROM employee WHERE "employee_id" = $1 OR "name" = $1 OR "role" = $1`
        const employee = await pool.query('SELECT * FROM employee WHERE "name" = $1', [name])
        console.log(employee)
        return res.status(200).send(employee.rows[0])
    } catch(err) {
        console.log(err)
        return res.status(400).send(err)
    }
})

app.put("/update_employee", bodyParser.json(), async (req,res) => {
     const { employee_id, newRole, newName } = req.body
     try {
        const change = await pool.query('UPDATE employee SET "role" = $1, "name" = $3 WHERE "employee_id" = $2',[newRole, employee_id, newName])
        console.log(change)
        return res.status(200).send(change)
     } catch(err) {
        return res.status(400).send(err)
     }
})

app.delete("/delete_employee/:id", bodyParser.json(), async (req,res) => {
    const { id } = req.params
    try {
        const deleted = await pool.query('DELETE FROM employee WHERE "employee_id" = $1 returning *',[id])
        console.log(deleted)
        return res.status(200).send(deleted)
    } catch(err) {
        console.log(err)
        res.status(400).send(err)
    }
})

app.get("/employee_api", async (req,res) => {
    console.log("teste 1")
    axios.get("https://randomuser.me/api/")
    .then((response) => {
        console.log(response.data.results[0].name.first + " " + response.data.results[0].name.last)
        let person = {}
        person.name = response.data.results[0].name.first + " " + response.data.results[0].name.last
        person.role = "Teste"
        return res.status(200).send(person)
    })  
    .catch((err) => {
        console.log(err)
        return res.status(400).send(err)
    })
})

app.get("/populate/:number", async (req,res) => {
    let { number } = req.params

    try {
        parsed_number = parseInt(number)
    } catch(err) {
        parsed_number = 10
    }

    axios.get(`https://randomuser.me/api/?results=${parsed_number}`)
    .then(({data}) => {
        data.results.forEach(async (person) => {
            console.log(`${person.name.first} ${person.name.last}`)
            const role = "-"
            try {
                const employee = await pool.query('INSERT INTO employee ("name", "role") values ($1, $2) returning employee_id',[person.name.first + " " + person.name.last, role])    
            } catch (error) {
                console.log(error)
            }
        });
        return res.status(200).send("Ok")
    })
    .catch((err) => {
        console.log(err)
        return res.status(400).send(err)
    })
})



app.listen(PORT, () => console.log("listening port " + PORT))