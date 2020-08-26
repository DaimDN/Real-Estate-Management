var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Home = require('../models/home');
var https = require('http');

router.get('/list', function(req, res, next){
    var url = "http://localhost:3000/api/v1/realestate";


    https.get(url, function(response){
        response.on('data', function(data){
            var apifetch = JSON.parse(data);
            var revapi = apifetch.reverse();
            console.log(revapi);
            res.render('pages/listing.ejs', {list: revapi});
        })
    })
})


router.get('/api/users', (req, res, next)=>{
	User.find().lean().exec(function (err, users) {
		return res.end(JSON.stringify(users));
	});	
	

})



router.post('/q=search', function(req, res, next){
    var query = req.body.q;
    var Location = req.body.location;
    var Type = req.body.type;

    User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			var array = [];
			var url = "http://localhost:3000/api/v1/realestate";

			https.get(url, function(response){
				response.on('data', function(data){
					var apifetch = JSON.parse(data);
					console.log(apifetch);
					res.render('search.ejs', {list : apifetch, auth: "/login", name: "LOGIN", loader: "", location : query});
				})
			})

		}else{
			var array = [];
			var url = "http://localhost:3000/api/v1/realestate";

			https.get(url, function(response){
				response.on('data', function(data){
					var apifetch = JSON.parse(data);
					console.log(apifetch);
					return res.render('search.ejs',{list: apifetch , auth: "/logout", name: "LOGOUT", loader: "", location : query});
				})
			})
			
		}
    });

})
module.exports = router;
