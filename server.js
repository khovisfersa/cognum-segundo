const express = require('express');
const cors = require('cors');

const { Pool } = require('pg');
const fs = require('fs');
const app = express();
require('dotenv').config();

app.use(cors({
	origin: '*'
}));


const PORT = process.env.PORT || 3333
app.listen(PORT)

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL
})

app.post("/create_employee", async (req,res)=> {
    const {id, name, role} = req.body
    try {
        // const employee = pool.query('INSERT INTO ') 
    } catch(err) {

    }
})