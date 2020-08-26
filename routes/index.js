var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Home = require('../models/home');
var https = require('http');




router.get('/', function (req, res, next) {
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			var array = [];
			var url = "http://localhost:3000/api/v1/realestate";

			https.get(url, function(response){
				response.on('data', function(data){
					var apifetch = JSON.parse(data);
					var revapi = apifetch.reverse();
           
					console.log(apifetch);
					res.render('home.ejs', {list : revapi, auth: "/login", name: "LOGIN", loader: ""});
				})
			})

		}else{
			var array = [];
			var url = "http://localhost:3000/api/v1/realestate";

			https.get(url, function(response){
				response.on('data', function(data){
					var apifetch = JSON.parse(data);
					var revapi = apifetch.reverse();
					return res.render('home.ejs',{list: revapi , auth: "/dashboard", name: "Dashboard", loader: ""});
				})
			})
			
		}
	});


});


router.get('/addestate', function(req, res){

	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.render('home.ejs');
		}else{
			//console.log("found");
			return res.render('dashcomp/addestate.ejs');
		}
	});
})



router.get('/register', function (req, res, next) {

	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.render('register.ejs');
		}else{
			//console.log("found");
			return res.redirect('/dashboard');
		}
	});

});



router.get('/api/v1/realestate', function(req, res, next){
	Home.find().lean().exec(function (err, users) {
		return res.end(JSON.stringify(users));
	});
})

router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"Successfully Registered."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.render('login.ejs');
		}else{
			//console.log("found");
			return res.redirect('/dashboard');
		}
	});
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				
				req.session.userId = data.unique_id;
				personName = req.body.email;
				res.send({"Success":"Success!"});

				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"Email is not Registered "});
		}
	});
});



router.get('/dashboard', function (req, res, next) {
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/404');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});


router.post('/search', function(req, res, next){
	var q = req.body.query;

	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/404');
		}else{
			
			q = "Search Result not Found"
			return res.render('dashcomp/search.ejs', {"name":data.username,"data":q});
		}
	});
})


router.get('/setting', function (req, res, next) {
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/404');
		}else{
			//console.log("found");
			return res.render('dashcomp/setting.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/profile', function (req, res, next) {
	
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('dashcomp/setting.ejs', {"name":data.username,"email":data.email});
		}
	});
});


router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {

	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{

			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});


router.post('/addestate', function(req, res){
	var name = req.body.name;
	var values = req.body.cost ;
	var location = req.body.Location;
	var desc = req.body.Description;
	var type = req.body.types;
	var imgurl = req.body.images;

	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.render('home.ejs');
		}else{

			Home.findOne({},function(err,data){
			
			var newHome = new Home({
				unique_id: Date.now(),
				propertyName: name,
				value: Number(values),
				Location : location,
				Description: desc,
				Date : Date.now(),
				Type : type,
				Imageurl : imgurl
				

			});
			console.log(newHome);
			newHome.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
			});
		});
	
			res.redirect('/addestate');





		}
	});
})

module.exports = router;