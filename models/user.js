const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 6 },
	image: { type: String, required: true },
	places: [ { type: mongoose.Types.ObjectId, required: true, ref: 'Place' } ],
	sentRequests: [ { user: { type: mongoose.Types.ObjectId, ref: 'User' }, date: Date } ],
	getRequests: [ { user: { type: mongoose.Types.ObjectId, ref: 'User' }, date: Date } ],
	friends: [ { user: { type: mongoose.Types.ObjectId, ref: 'User' }, date: Date } ],
	bucketList: [
		{
			id: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' },
			_id: false,
			createdBy: { type: String },
			isVisited: { type: Boolean }
		}
	]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
