const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const methodOverride = require('method-override');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const reviewsRoutes = require('./routes/reviews-routes');
const socialAuthRoutes = require('./routes/social-auth-routes.js');
const HttpError = require('./models/http-error');
const searchRoutes = require('./routes/search-routes');
const friendsRoutes = require('./routes/friend-routes');

const app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.json());

app.use(cors());
app.options('*', cors());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use(express.static(path.join('puplic')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});

app.use('/api/socialMedia', socialAuthRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api', searchRoutes);
app.use('/api', searchRoutes);

app.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route.", 404);
//   throw error;
// });

app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			console.log(err);
		});
	}
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose.set('useCreateIndex', true);
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-wqgsj.mongodb.net/${process.env
			.DB_NAME}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		}
	)
	.then(() => {
		app.listen(process.env.PORT || 5000);
	})
	.catch((err) => {
		console.log(err);
	});
