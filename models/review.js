const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	date: { type: Date, required: true },
	userId: { type: String, required: true },
	reviewTxt: { type: String, required: true, minlength: 6 },
	placeId: { type: String, required: true },
	creator: { name: String, image: String }
});

// reviewSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Review', reviewSchema);
