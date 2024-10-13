require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT =  process.env.PORT || 3500;

app.use(logger);
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/',express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/updateProfile', require('./routes/api/updateaccount'));
app.use('/changePassword', require('./routes/api/changePassword'));

app.all('*',(req, res)=>{
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts('json')){
        res.json({"error":"404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`server running on port ${PORT}`));