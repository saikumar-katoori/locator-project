const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URI;
if (!dbURI) {
	throw new Error('MONGODB_URI environment variable not set');
}
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
console.log(`MongoDB connected`);
});
mongoose.connection.on('error', err => {
console.log(`MongoDB connection error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
console.log('MongoDB disconnected');
});
const gracefulShutdown = async (msg) => {
	await mongoose.connection.close();
	console.log(`MongoDB disconnected through ${msg}`);
};
// For nodemon restarts
process.once('SIGUSR2', async () => {
	await gracefulShutdown('nodemon restart');
	process.kill(process.pid, 'SIGUSR2');
});
// For app termination
process.on('SIGINT', async () => {
	await gracefulShutdown('app termination');
	process.exit(0);
});
// For Heroku app termination
process.on('SIGTERM', async () => {
	await gracefulShutdown('Heroku app shutdown');
	process.exit(0);
});