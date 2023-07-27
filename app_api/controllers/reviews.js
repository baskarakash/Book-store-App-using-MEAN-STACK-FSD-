var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/*const doSetAverageRating = async (req,r) => {
 if (rr.reviews && rr.reviews.length > 0) {
	  console.log('inside if');
    const count = rr.reviews.length;
    const total = rr.reviews.reduce((acc, {rating}) => {
      return acc + rating;
    }, 0);
	console.log('${total}');

    rr.rating = parseInt(total / count, 10);
    await rr.save();
    console.log('Average rating updated to ${location.rating}');
      }
    };*/
  

const updateAverageRating =async (locationId) => {
	const t=await Loc.findById(locationId).select('rating reviews').exec(); 
    if(t) 
	{
		if (t.reviews && t.reviews.length > 0) {
			const count = t.reviews.length;
			const total = t.reviews.reduce((acc, {rating}) => {
				return acc + rating;
				}, 0);
			console.log('${total}');

			t.rating = parseInt(total / count, 10);
			await t.save();
    console.log('Average rating updated to ${location.rating}');
    
	}		
	}	//  doSetAverageRating(t);
};

const doAddReview = async (req, res, location) => {
	  if (!location) 
	  {
		res.status(404).json({"message": "Location not found"});
	  } 
	else 
	{
    const {author, rating, reviewText} = req.body;
    location.reviews.push({
      author,
      rating,
      reviewText
    });
    const t1= await location.save(); 
	if (!t1) 
	{
        res
          .status(400)
          .json(err);
      } 
	  else {
        updateAverageRating(t1._id);
        const thisReview = t1.reviews.slice(-1).pop();
        res.status(201).json(thisReview);
      }
    }
  
};

const reviewsCreate =async  (req, res) => {
  const locationId = req.params.locationid;
  if (locationId) {
    const t2=await Loc.findById(locationId).select('reviews').exec();
	if (!t2) {
          res
            .status(400)
            .json(err);
        } else {
          doAddReview(req, res, t2);
        }
      }
   else {
    res
      .status(404)
      .json({"message": "Location not found"});
  }
};

const reviewsReadOne =async (req, res) => 
{
	 try 
	{
        const activity = await Loc.findById(req.params.locationid).select('name reviews').exec();
        if (activity.reviews && activity.reviews.length > 0) 
		{
			const review = activity.reviews.id(req.params.reviewid);
			if (!review) 
			{
				return res.status(400).json({
					"message": "review not found"
				});
			} 
			else 
			{
				response = {
					activity : {
					name : activity.name,
					id : req.params.locationid
				},
					review
				};
				return res.status(200).json(response);
			}
		} 
		else 
		{
			return res.status(404).json({
				"message": "No reviews found"
				});
		}	
    } 
	catch (error) 
	{
        res.send(error.message)
    }
};
const reviewsUpdateOne =async (req, res) => 
{ 
	if (!req.params.locationid || !req.params.reviewid) 
	{
		return res.status(404).json({"message": "Not found, locationid and reviewid are both required"});
	}
	try
	{
		const r=await Loc.findById(req.params.locationid).select('reviews').exec();
		if (!r) 
		{
			return res.status(404).json({
			"message": "Location not found"
			});
		} 
		if (r.reviews && r.reviews.length > 0) 
		{
			const thisReview = r.reviews.id(req.params.reviewid);
			if (!thisReview) 
			{
				res.status(404).json({
					"message": "Review not found"
				});
			} 
			else 
			{
				thisReview.author = req.body.author;
				thisReview.rating = req.body.rating;
				thisReview.reviewText = req.body.reviewText;
				await r.save(); 
				updateAverageRating(r._id);
				res.status(200).json(thisReview);
			}
		}
		else 
		{
			res.status(404).json({
				"message": "No review to update"
			});
		}
	}
	catch(error)
	{
		res.status(400).json(error);
	}
};
const reviewsDeleteOne =async (req, res) => 
{
	const {locationid, reviewid} = req.params;
	if (!locationid || !reviewid) 
	{
		res.status(404).json({'message': 'Not found, locationid and reviewid are both required'});
	}
	try
	{
		const t= await Loc.findById(locationid).select('reviews').exec();
		if (!t) 
		{
			res.status(404).json({'message': 'Location not found'});
		} 
		if (t.reviews && t.reviews.length > 0) 
		{
			if (!t.reviews.id(reviewid)) 
			{
				res.status(404).json({'message': 'Review not found'});
			} 
			else 
			{
			
				const p = await Loc.findById(locationid);
				p.reviews.pull({_id: reviewid});
				await p.save();
				//const t1=await t.reviews.id.remove(reviewid).exec();
				//const result = await Loc.remove(t.reviews.id(reviewid)).exec();
				/*console.log('id match');
				await t.save();
				if (!t1) 
				{
					res.status(404).json(err);
				} 
				else 
				{*/
					updateAverageRating(t._id);
					res.status(204).json(null);
				//}	
			}
		}
		else 
		{
			res.status(404).json({'message': 'No Review to delete'});
		}
	}
	catch(err) 
	{
		res.status(400).json(err);
	}
 };

module.exports = {
	reviewsCreate,
	reviewsReadOne,
	reviewsUpdateOne,
	reviewsDeleteOne
};
