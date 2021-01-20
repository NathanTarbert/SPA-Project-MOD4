// Imports for Node packages
var express = require("express"); // Handles routing
var app = express(); // Server for handling routes, the heart of our app
var axios = require("axios"); // Handles GET, POST etc request and responses
const bodyParser = require("body-parser"); // Middleware for dealing with form input data
// Express server setup (boilerplate code from the docs)
app.set("view engine", "ejs");
// BodyParser middleware setup (boilerplate code from the docs)
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
// Tells express where to find any static files like images
app.use(express.static("public"));
/// ** -- ROUTES -- ** ///
// GET Home page which renders the index.ejs template. No data needed for plain HTML.
app.get("/", function (req, res) {
	res.render("pages/index");
});
// POST a new employee route
app.post("/create_employee", function (req, res) {
		console.log("req1 is", req);
		var newUser = req.body.user;
		// console.log(newUser);
		var data = `{"email":"${newUser.email}","firstName":"${newUser.firstName}","id":"${newUser.id}","lastName":"${newUser.lastName}","picture":"${newUser.picture}","title":"${newUser.title}"}`;
		console.log(data);
		var config = {
			method: 'post',
			url: 'https://project-8e206-default-rtdb.firebaseio.com/data/.json',
			headers: { 
			  'Content-Type': 'text/plain'
			},
			data : data
		  };
		  
		  axios(config)
		  .then(function (response) {
			// console.log(response.data.user);
		  })
		  .catch(function (error) {
			console.log(error);
		  });
		res.redirect("/success");
		});
// GET Directory of employees, returns an array of objects from the server.
app.get("/directory", function (req, res) {
	// Modify the route and the views
	var config = {
		method: 'get',
		url: 'https://project-8e206-default-rtdb.firebaseio.com/data/.json',
		headers: { }
	  };
	  axios(config)
	  .then(function (response) {
		// console.log(response.data);
		let responseArr = Object.entries(response.data);
		return responseArr;
	  })
	  .then((employees) => {
		res.render("pages/directory", {
			employees: employees,
		});
	})
	  .catch(function (error) {
		console.log(error);
	  });
});
// GET static about page
app.get("/about", function (req, res) {
	res.render("pages/about");
});
// Single Employee
// "Render" the person view here!
app.get("/directory/:uid", function (req, res) {
	// console.log(req);
	let id = req.params.uid;
	console.log("This is the id" + id);
	var config = {
		method: 'get',
		url: `https://project-8e206-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { }
	  };
	  
	  axios(config)
	  .then(function (response) {
		let dataFromApi = response.data;
		return dataFromApi;
	  })
	  .then(function (response) {
		//   console.log(response);
		  res.render("pages/person", {
		employee: response
		});
		 
	  })
	  .catch(function (error) {
		console.log(error);
	  });
	
});
// GET Form to add new employee (GET the form first, then the forms "submit" button handles the POST request.
app.get("/create_employee", function (req, res) {
	res.render("pages/create_employee");
	// console.log("this is the user 2", res);
});
app.get("/success", function (req, res) {
	res.render("pages/success");
	// console.log("this is the user 2", res);
});
//Update Emp via PATCH
var updateEmpId; //this holds id for update POST request below...
app.get("/edit/:uid", function (req, res) {
	let id = req.params.uid;
	updateEmpId = id;
	// console.log(employee)
	var config = {
		method: 'get',
		url: `https://project-8e206-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { }
	  };
	  axios(config)
	  .then(function (response) {
		let dataFromApi = response.data;
		return dataFromApi;
	  })
	  .then(function(response){
		//   console.log(response)
		res.render("pages/edit", {
			employee: response, //<--this is your variable key that you will use in your page templating
		});
	})
	  .catch(function (error) {
		console.log(error);
	  });
});
//update employee
app.post("/edit/:uid", function (req, res) {
	console.log("update post function fired");
	let id = updateEmpId;
	console.log(id);
	let user = req.body.user;
	console.log(user);
	var newName = `{"firstName":"${user.firstName}"}`;
	console.log(newName);
	var config = {
		method: 'patch',
		url: `https://project-8e206-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { 
		  'Content-Type': 'text/plain'
		},
		data : newName
	  };
	  axios(config)
	  .then(function (response) {
		console.log(response.status);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
	res.redirect("/directory");
});
//DELETE EMP
app.get("/delete/:uid", function (req, res) {
	// console.log(req);
	let id = req.params.uid;
	// console.log(id);
	var config = {
		method: 'delete',
		url: `https://project-8e206-default-rtdb.firebaseio.com/data/${id}/.json`,
		headers: { 
			'Content-Type': 'text/plain'
		  },
	  };
	  axios(config)
	  .then(function (response) {
		let dataFromApi = response.data;
		return dataFromApi;
	  })
	  .then(function(response){
		//   console.log(response)
		res.redirect("/directory");
	})
	  .catch(function (error) {
		console.log(error);
	  });
});
// Express's .listen method is the final part of Express that fires up the server on the assigned port and starts "listening" for request from the app! (boilerplate code from the docs)
app.listen(2001);
console.log("Port 2001 is open");






