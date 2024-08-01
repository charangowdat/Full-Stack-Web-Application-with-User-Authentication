const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');
dotenv.config({ path: './config.env' });

//Atlas
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

//Local Database
const DB = process.env.DTATABASE_LOCAL;

mongoose
  .connect(DB)
  .then(() => console.log('\n"DB connection successful💣💣!!!!!\n'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('App running!!!');
});
