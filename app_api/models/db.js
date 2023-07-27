const mongoose = require('mongoose');

const dbURI = 'mongodb://0.0.0.0:27017/Loc8r';
//const dbURI = 'mongodb+srv://mailz4r:123MongodbAtlas@cluster0.4tko8qu.mongodb.net/loc8r';

mongoose.connect(dbURI, {useNewUrlParser: true});
mongoose.connection.on('connected', () => {
 console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => {
	console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
 console.log('Mongoose disconnected');
});


const gracefulShutdown = (msg, callback) => {
  console.log('Mongoose disconnected through ${msg}');
 callback();
 
};
process.once('SIGUSR2', () => {
 gracefulShutdown('nodemon restart', () => {
 process.kill(process.pid, 'SIGUSR2');
 });
});
process.on('SIGINT', () => {
 gracefulShutdown('app termination', () => {
 process.exit(0);
 });
});
process.on('SIGTERM', () => {
 gracefulShutdown('Heroku app shutdown', () => {
 process.exit(0);
 });
});
require('./locations'); 