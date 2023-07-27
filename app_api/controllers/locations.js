var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
 res
	.status(200)
	.json({"status" : "success"});
};
const locationsListByDistance = async (req, res) => 
{
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  if (!lng || !lat) 
  {
    return res.status(404).json({ "message": "lng and lat query parameters are required" });
  }

  try {
    const results = await Loc.find(
	{
		"coords": 
		{
			$near: 
			{
				$geometry: 
				{
					type: "Point" ,
					coordinates: [ lng , lat ]
				},
			}
		}
	});
    const locations = await results.map(result => {
      return {
        _id: result._id,
        name: result.name,
        address: result.address,
        rating: result.rating,
        facilities: result.facilities,
		//distance: `${result.distance.calculated.toFixed()}m`

       
      }
    });
    res.status(200).json(locations);
  } 
  catch (err) {
    res.status(404).json(err);
  }
};

const locationsCreate = async(req, res) => {
 try{
	 const result=await Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: {
      type: "Point",
      coordinates: [
        parseFloat(req.body.lng),
        parseFloat(req.body.lat)
       ]
    },
    openingTimes: [
      {
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1
      },
      {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2
      }
    ]
  });
  
      res.status(201).json(result)
    
  }
  catch (error) 
	{
        res.status(404).json(error)
    } 
};
const locationsReadOne = async (req, res) => 
{
    try 
	{
        const activity = await Loc.findById(req.params.locationid).exec();
		if(!activity)
		{
			 res .status(404).json({
						"message": "location not found"
				})
		}
		else
		{
			res.status(200).json(activity)
		}
    } 
	catch (error) 
	{
        res.status(404).json(error)
    }
};	

const locationsUpdateOne =async (req, res) => 
{ 
	if (!req.params.locationid) 
	{
		return res.status(404).json({"message": "Not found, locationid is required"});
	}
	try
	{
		const activity = await Loc.findById(req.params.locationid).select('reviews rating').exec(); 
		if (!activity) 
		{
			return res.json(404).status({"message": "locationid not found"});
		} 
		activity.name = req.body.name;
		activity.address = req.body.address;
		activity.facilities = req.body.facilities.split(',');
		activity.coords = 
		{
			type: "Point",
			coordinates:[
				parseFloat(req.body.lng),
				parseFloat(req.body.lat)
			]
		};
		activity.openingTimes = [{
		days: req.body.days1,
		opening: req.body.opening1,
		closing: req.body.closing1,
		closed: req.body.closed1,
		}, {
		days: req.body.days2,
		opening: req.body.opening2,
		closing: req.body.closing2,
		closed: req.body.closed2,
		}];
		const t1=activity.save(); 
		if(t1) 
		{
			res.status(200).json(activity)
		}
	}
	catch(err)
	{
		res.status(404).json(error)
	}
};
const locationsDeleteOne = async (req, res) => 
{ 
	try
	{
		const {locationid} = req.params;
		if (locationid) 
		{
			const t= await Loc.findByIdAndRemove(locationid).exec();
			if(t)
				res.status(204).json(null);
		}
		else 
		{
			res.status(404).json({"message": "No Location"});
		}
	}
	catch (err) 
	{
		res.status(404).json(err)
	}
};

module.exports = {
 locationsListByDistance,
 locationsCreate,
 locationsReadOne,
 locationsUpdateOne,
 locationsDeleteOne
};



















