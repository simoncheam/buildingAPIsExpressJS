const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // !!!add to notes
const apiRouter = require('./routes');
const Swal = require('sweetalert2')


let app = express();

//middleware - always use "use", most of the time
app.use(cors());
app.use(morgan("dev")); 
app.use(express.json()); //!!! DONT FORGET! interpreter for json req.body
app.use(express.urlencoded({
    extended:false
})); 

app.use(express.static('client'));
app.use('/api', apiRouter);

app.listen(3000, ()=>console.log('Listening on localhost:3000'));