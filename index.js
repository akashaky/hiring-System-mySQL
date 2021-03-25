const config = require('config');
const express = require('express');
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', require('./routes/index'));

if(!config.get('jwtPrivateKey')){
  console.log('JWT is not defined');
  process.exit(1);
}

app.listen(port, function(err){
  if(err){
      console.log('Error in running the server');
      return;
  }
  console.log(`Server is running on port ${port}`);
});