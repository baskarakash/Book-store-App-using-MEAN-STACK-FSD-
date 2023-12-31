var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
// locations
router
	.route('/locations')
	.get(ctrlLocations.locationsListByDistance)
	.post(ctrlLocations.locationsCreate);
router
	.route('/locations/:locationid')
	.get(ctrlLocations.locationsReadOne)
	.put(ctrlLocations.locationsUpdateOne)
	.delete(ctrlLocations.locationsDeleteOne);
// reviews
router
	.route('/locations/:locationid/reviews')
	.post(ctrlReviews.reviewsCreate);
router
	.route('/locations/:locationid/reviews/:reviewid')
	.get(ctrlReviews.reviewsReadOne)
	.put(ctrlReviews.reviewsUpdateOne)
	.delete(ctrlReviews.reviewsDeleteOne);
module.exports = router;