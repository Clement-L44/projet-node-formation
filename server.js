const mongoose = require('mongoose');

const app = require('./app');


//Connect to MongoDB

const MONGODB = process.env.MONGODB_DATABASE.replace(
    '<PASSWORD>', 
    process.env.MONGODB_PASSWORD
);

console.log(process.env.PORT);

mongoose.connect(MONGODB).then(() => console.log('DB connection successful !'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port));