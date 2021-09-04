const express = require('express');
const chirpstore = require('../chirpstore');
const moment = require('moment');
let router = express.Router();


//GET ---- THIS works!  // http://localhost:3000/api/chirps/2

router.get('/:id?', (req, res) => { /// ?= optional , no ? = required

    console.log(`PIZZA! - We'll see this is the console.`);

    let id = req.params.id;
    if(id){
        res.json(chirpstore.GetChirp(id))
    }else {
        res.json(chirpstore.GetChirps());
    }


});


//POST ---- THIS works! //http://localhost:3000/api/chirps/new

router.post('/new', (req, res) => {
    const newChirp= req.body;
    const chirpTime = {
        ...newChirp,
        createdAt: moment(Date.now()).calendar()  // injected extra prop
    
    }
    chirpstore.CreateChirp(chirpTime);  // req.body = represents form data filled out

    console.log(req.originalUrl);
    console.log('Router Post Section');

    res.status(201).json({msg: "chirp created"}); //created
});



//PUT ----   // http://localhost:3000/api/chirps/4

router.put('/:id', (req, res) => {
    let id = req.params.id;
    const editChirp= req.body;
    const chirpTime = {
        ...editChirp,
        createdAt: `edited at ${moment(Date.now()).calendar()}`  // injected extra prop
    
    }


    chirpstore.UpdateChirp(id, chirpTime)

    console.log('Router Put Section');
    console.log(req.originalUrl);
    res.status(201).json({msg: "chirp updated"}); //updated
});


//DELETE ---- This section console works, but deletion not setup: // http://localhost:3000/api/chirps/1

router.delete('/:id', (req, res) => {
    let id = req.params.id;

    console.log('Router Delete Section');
    console.log(req.originalUrl);
    chirpstore.DeleteChirp(id);

   res.status(200).json({msg: "chirp deleted"}); //created
});


module.exports = router;