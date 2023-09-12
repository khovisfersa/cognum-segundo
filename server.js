const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


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

// app.get("/read_employee", bodyParser.json(), async (req,res) => {
//     const { query_info } = req.params
//     try{
//         let query = "SELECT * FROM employee WHERE employee_id = $1 OR name = $1 OR role = $1"
//         const employee = await pool.query(query, [query_info])
//     } catch(err) {
//         console.log(err)
//         return res.status(400).send(err)
//     }
// })

app.listen(PORT, () => console.log("listening port " + PORT))