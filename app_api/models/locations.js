const mongoose = require('mongoose'); 

const reviewSchema = new mongoose.Schema({
 author: String,
 rating: {
	 type: Number,
 required: true,
 min: 0,
 max: 5
 },
 reviewText: String,
 createdOn: {type: Date, default: Date.now}
});
const locationSchema = new mongoose.Schema({
 bookname: {
 type: String,
 required: true
 },
 bookdescription: String,
 rating: {
 type: Number,
 'default': 0,
 min: 0,
 max: 5
 },
 genres: [String],
 reviews: [reviewSchema]
});
locationSchema.index({coords: '2dsphere'});
mongoose.model('Location', locationSchema);