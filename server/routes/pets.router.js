const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// This route *should* return the logged in users pets
router.get('/', (req, res) => {
    console.log('/pet GET route');
    console.log('is authenticated?', req.isAuthenticated());
    if(req.isAuthenticated()) {
    console.log('user', req.user);
    let queryText = `SELECT * FROM "pets"`;
    pool.query(queryText, [req.user.id]).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
}
});

// This route *should* add a pet for the logged in user
router.post('/', (req, res) => {
    console.log('/pet POST route');
    console.log(req.body);
    // req.isAuthenticated() is a function provided 
    // by passport. It returns either true or false.
    console.log('is authenticated?', req.isAuthenticated());
    if (req.isAuthenticated()) { 
        console.log('user', req.user);    
        // Add the pet to database
        let queryText = `INSERT INTO "pets" ("name","user_id")
                         VALUES ($1, $2)`
                         // ! req.user.id is the current logged in user's id
        pool.query(queryText, [req.body.name, req.user.id])
            .then(results => {
                res.sendStatus(201)
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            })
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;