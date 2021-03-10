 const  Sequelize = require('sequelize');
 const DataTypes = Sequelize.DataTypes

 const db = new Sequelize('hiring','akash1', '12345',{
     host: 'localhost',
     dialect: 'mysql'
 })

 db.authenticate()
      .then(()=> console.log('DataBase connection established'))
      .catch((err)=> console.log(err))

module.exports.db = db;