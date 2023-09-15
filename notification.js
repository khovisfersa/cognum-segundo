const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
var router = express.Router();


const { Pool } = require('pg');

router.use(cors());
router.use(express.json())

function send_notification(email, name , msg) {
    console.log(`(sent to ${email} \n Hello ${name}! \n ${msg}`)
}

router.post('/send_notification', async (req,res) => {
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    });
    const { list, message } = req.body 
    // console.log(`list: ${list}`)
    // console.log(`message: ${message}`)
    try {
        let counter = 0
        list.forEach( async (id) => {
            try {
                console.log(`id: ${id}`)
                const {rows} = await pool.query('select * from employee where "employee_id" = $1',[id]) 
                console.log(rows[counter])           
                send_notification(rows[counter].email, rows[counter].name, message)
            } catch (error) {
                // console.log(`message couldn't be sent to ${user.rows.name} at ${user.rows.email}`)
                console.log(error)
            }
            finally {
                counter = counter++
            }

        });
        return res.status(200).send("Messages sent sucessfully")
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

module.exports = router;