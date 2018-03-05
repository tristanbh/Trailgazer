
// stores data from hiking project
// data comes from getTrails()
var trails = {};

// stores data from iNaturals API
// data pertains to last clicked trail
var species = [];

// stores searched location data
// data comes from geocode()
// geolocate() data used if available
var geoData = {};

// locations of top rated trails
// used as placeholders on page load
var placeholder = [
	{lat: 37.2928, lng: -113.0081},
	{lat: 40.2340, lng: -105.6419},
	{lat: 40.3710, lng: -105.6419},
];

// needed for initAutocomplete
// some things do not work if not global
var placeSearch;
var componentForm = { };

var map;


// Get user name and location
$(document).ready(function() {
	console.log("document.ready");

	showRandom();

	geolocate();

	$("#address-submit").on("click", function() {

		var address = $("#address-input").val().trim();
		geocode(address);
	});

	$(".search-results").on("click", "img", showDetails);

	$("body").on("click", ".directionButtonClass", function(event) {
//<<<<<<< HEAD
		//var spefLat = $(this).attr("data-lat");
		//var spefLng = $(this).attr("data-lng");
		//var spefName = $('#trail-name').text();


//=======
		var spefLat = $(this).attr("data-lat");
		var spefLng = $(this).attr("data-lng");
		var spefName = $(this).attr("data-name");
//>>>>>>> 6a35da23598115942321152b19b5d9a82f0a64d6

		var url = "https://www.google.com/maps/dir/?api=1";
		//var origin = "&origin=" + tempLatitude + "," + tempLongitude;
		var destination = "&destination=" + spefName;
		var newUrl = new URL(url  + destination);

		window.open(newUrl , "_blank");
	});
});



// Google Maps API
// executes upon search submit
// gets lat, lng, place_id
// sends results to getTrails()
function geocode(address) {
	event.preventDefault();

	console.log("geocode: " + address);

	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?key=";

	queryURL += keyMaps + "&address=" + address;

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {
		var status = response.status;
		if (status === "OK") {

			var resultRef = response.results[0];
			var place_id = resultRef.place_id;
			var formatted_address = resultRef.formatted_address;

			var locationRef = resultRef.geometry.location;
			var lat = locationRef.lat;
			var lng = locationRef.lng;

			geoData = {
				"lat": lat,
				"lng": lng,
				"place_id": place_id,
				"address": formatted_address
			};

			getTrails(lat, lng);
			console.log(lat, lng);

		} else {
			alert('Geocode unsuccessful.');
		}
	});

	//May want to validate response somehow later
}

// executes upon page load
// shows random place results
function showRandom() {
	console.log("showRandom");

	var rand = Math.floor(Math.random()*placeholder.length);
	var lat = placeholder[rand].lat;
	var lng = placeholder[rand].lng;

	getTrails(lat, lng);
	mapBox(lat, lng);
}

// executes when result img clicked
// generates details card HTML
function showDetails() {
	console.log("showDetails");

	window.scrollTo(0, 160);

	var self = $(this);
	var index = self.data("index");
	var lat = self.data("lat");
	var lng = self.data("lng");

	$.each(trails[index], function populate(key, value) {

		if ( $(`#trail-${key}`) ) {
			$(`#trail-${key}`).text(value);
		}

		if ( ($(`#trail-${key}`)) && (key.startsWith("length")) ){
			$(`#trail-${key}`).prepend("Length: ");
			$(`#trail-${key}`).append(" mi");
		}

		$("#trail-imgMedium").attr("src", self.attr("src"))

		var imageSource = $(this).attr("src");


		if 	($("#trail-difficulty").text() === "green") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffGreen30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Easier</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "greenBlue") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffGreenBlue30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Easier/Moderate</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "blue") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlue30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Moderate</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "blueBlack") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlueBlack30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Moderate/Hard</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "black") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlack30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Hard</h5></span>');
		}
		if 	($("#trail-difficulty").text() === "dblack") {
			$("#trail-difficulty").html('<h5 id="diffCard"><img src="assets/images/diffBlack30.svg" id="difficultyImgLg"></h5>');
			$("#trail-difficulty").append('<span id="diffSecondary"><h5>Hard</h5></span>');
		}

	});

////<<<<<<< HEAD
	//$("#directionButtonCard").html("<button class= directionButtonClass>Get Directions</button")

	//$("#favoriteButtonCard").html("<button class= favorite-button>Favorite</button>")

////=======
	iNaturalist(lat, lng);
	getWeather(lat, lng);

	map.flyTo({
		center: [lng, lat]
	});
////>>>>>>> 6a35da23598115942321152b19b5d9a82f0a64d6
}

// Firebase database
	// Initialize Firebase
	var config = {
	    apiKey: "AIzaSyDgCGQByTB-VEChXM6Dssa_Xir_EcGJHJA",
	    authDomain: "class-project-trails-api.firebaseapp.com",
	    databaseURL: "https://class-project-trails-api.firebaseio.com",
	    projectId: "class-project-trails-api",
	    storageBucket: "class-project-trails-api.appspot.com",
	    messagingSenderId: "334324080267"
	};

	if (firebase.apps.length === 0){
	firebase.initializeApp(config);
	}

	// Get a reference to the database service
	var database = firebase.database();


// saves clicked item to favorites
// pushes to Firebase
function saveToFavorites(event) {

    event.preventDefault();

    var i = $(this).data('index');
    var favoriteHike = trails[i].name;
    var url = trails[i].url;

    var newFavTrail = {
      name: favoriteHike,
      site: url
    };

    database.ref().push(newFavTrail);
};

// refreshes our HTML list based on added or deleted data
function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += "<li data-key=" + list[i].key + ">" + "<a href=" + list[i].url + ">" + list[i].name + "</a>" + " " + genLinks(list[i].key, list[i].name) + '</li>';
    };
    document.getElementById('favorite-list').innerHTML = lis;
};

// generates our delete link as our favorites are saved
function genLinks(key, name) {
    var links = '';
    links += '<a class="button" href="javascript:del(\'' + key + '\')">[Delete]</button>';
    return links;
};

// delete function which calls the database through buildEndPoint and deletes the items from our list
function del(key) {
        var deleteFavorites = buildEndPoint(key);
        deleteFavorites.remove();
    }

// returning our most up to date database
function buildEndPoint (key) {
	return database.ref(`/${key}`) ;
}

// taking our database and populating info on initial load as well as any other updates
database.ref().on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].name;
            url = data[key].site;
                list.push({
                name: name,
                key: key,
                url: url

            })
        }
    }
// calling our refreshUI on our most up to date list to HTML
    refreshUI(list);
});


// REI Hiking Project API
// source of hiking trail data
function getTrails(lat, lng) {
	console.log("getTrails of " + lat + ", " + lng);

	var queryURL = "https://www.hikingproject.com/data/get-trails?key=";


	var milesRadius = "&maxDistance=10";

	var sourceSelect = $("#source");

	if(sourceSelect.val() === "10 Miles" ) {
    		milesRadius = "&maxDistance=10";
    }

    if(sourceSelect.val() === "20 Miles" ) {
    		milesRadius = "&maxDistance=20";
    }

    if(sourceSelect.val() === "30 Miles" ) {
    		milesRadius = "&maxDistance=30";
    }

	if(sourceSelect.val() === "40 Miles" ) {
    		milesRadius = "&maxDistance=40";
    }

	if(sourceSelect.val() === "50 Miles" ) {
    		milesRadius = "&maxDistance=50";
    }

	if(sourceSelect.val() === "60 Miles" ) {
    		milesRadius = "&maxDistance=60";
    }

	if(sourceSelect.val() === "70 Miles" ) {
    		milesRadius = "&maxDistance=70";
    }

	if(sourceSelect.val() === "80 Miles" ) {
    		milesRadius = "&maxDistance=80";
    }

	if(sourceSelect.val() === "90 Miles" ) {
    		milesRadius = "&maxDistance=90";
    }

	if(sourceSelect.val() === "100 Miles" ) {
    		milesRadius = "&maxDistance=100";
    }

	queryURL += keyTrails + "&lat=" + lat + "&lon=" + lng + milesRadius + "&maxResults=50/";

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {

		var status = response.success;

		if (status === 1) {

			trails = response.trails;

			setLocalStorage("trails", trails);

			renderCards();

		} else {
			alert("Trails query unsuccessful.");
		}
	});

	//May want to validate response somehow later
}

// Open Weather API
function getWeather(lat, lng) {
	console.log("getWeather", lat, lng);

	var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=imperial&appid=" + keyWeather;

	var weatherText;

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {

		weatherText = response.weather[0].description;
		$("#currentTempId").html(response.main.temp + "°F");
		//$("#tempSummaryId").html(response.weather[0].description)

		//generates weather icons
		//source: https://codepen.io/baumant/pen/Yyyoqd
		weatherText = weatherText.split(" ");

		for (i = 0; i <= weatherText.length - 1; i++) {
			if (weatherText[i] == "clear") {
		  		$('.icon').css('background-position', '505px -10px');
			} else if (weatherText[i] == "overcast" || weatherText[i] == "clouds" || weatherText[i] == "cloudy") {
		  		$('.icon').css('background-position', '505px -86px');
			} else if (weatherText[i] == "rain" || weatherText[i] == "rainy") {
		  		$('.icon').css('background-position', '220px -158px');
			}
	    }
	});


}

// generates dynamic HTML from results
// fills in placeholder if img not available
function renderCards() {
	console.log("renderCards");

	$("#resultList").empty();

	for (i = 0; i < trails.length; i++) {

		var card = $("<div>");
		var image = $("<img>");
		var nameDiv = $('<div class="name">');
		var lengthDiv = $('<div class="length">');
		var difficultyDiv = $('<div class="difficulty">');
		var directionButton= $("<button>");
		var favoriteButton = $("<button>");

		card.addClass("imgDiv col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3");
		image.attr("src", trails[i].imgMedium);
		image.attr("alt", trails[i].name);

		image.data("index", i);
		nameDiv.text(trails[i].name);
		lengthDiv.text(trails[i].length + " mi");
		difficultyDiv.text(trails[i].difficulty);
		directionButton.text("Get Directions");
		directionButton.addClass("directionButtonClass");
		directionButton.attr("data-lat", trails[i].latitude);
		directionButton.attr("data-lng", trails[i].longitude);
		directionButton.attr("data-name", trails[i].name);
		favoriteButton.text("Favorite");
		favoriteButton.addClass("favorite-button");
		favoriteButton.data("index", i);
		favoriteButton.on('click', saveToFavorites);

		image.data("lat", trails[i].latitude);
		image.data("lng", trails[i].longitude);


		if (image.attr("src") === "") {
			image.attr("src", "assets/images/random-image.jpg");
		}

		if (difficultyDiv.text() === "green"){
			difficultyDiv.html('<h5><img src="assets/images/diffGreen30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "greenBlue"){
			difficultyDiv.html('<h5><img src="assets/images/diffGreenBlue30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "blue"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlue30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "blueBlack"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlueBlack30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "black"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlack30.svg" id="difficultyImg"></h5>');
		}
		if (difficultyDiv.text() === "dblack"){
			difficultyDiv.html('<h5><img src="assets/images/diffBlack30.svg" id="difficultyImg"></h5>');
		}

		card.append(image);
		card.append(nameDiv);
		card.append(lengthDiv);
		card.append(difficultyDiv);
		card.append(directionButton);
		card.append(favoriteButton);

		$("#resultList").append(card);
	}

	$(".search-results img").first().click();

	//change map location
}

// Google Maps Places API
// used to fillInAddress
function initAutocomplete() {

	autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('address-input')),
	    {types: ['geocode']});

	console.log(autocomplete);

	autocomplete.addListener('place_changed', fillInAddress);

	return autocomplete;
}

// Google Maps Places API
// executes upon page load
// requests location from user's browser
function geolocate() {
	console.log("geolocate");

	if (navigator.geolocation) {

		var geoLat, geoLng;

		navigator.geolocation.getCurrentPosition(function(position) {

			var geolocation = {
			  lat: position.coords.latitude,
			  lng: position.coords.longitude
			};

			//put into search function

			var circle = new google.maps.Circle({
			  center: geolocation,
			  radius: position.coords.accuracy
			});

			geoLat = geolocation.lat;
			geoLng = geolocation.lng;

			autocomplete.setBounds(circle.getBounds());

			getTrails(geoLat, geoLng);
		});
    }
}

// Google Maps Places API
// executes upon start of input entry
// autocompletes search input
function fillInAddress() {

	var place = autocomplete.getPlace();

	for (var component in componentForm) {

	  document.getElementById(component).value = '';
	  document.getElementById(component).disabled = true;
	}

	for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (componentForm[addressType]) {
			var val = place.address_components[i][componentForm[addressType]];
			document.getElementById(addressType).value = val;
		}
	}
}

function mapBox(lat, lng) {

	mapboxgl.accessToken = 'pk.eyJ1IjoidHJpc3RhbmJoIiwiYSI6ImNqYmM5N20zbTFneWQzMm1yOTMzdnhwbjkifQ.LsCkehEVMnMWOEui5tZDCw';

	map = new mapboxgl.Map({
	    container: 'map',
	    center: [lng, lat],
	    zoom: 15,
	    style: 'mapbox://styles/tristanbh/cjbc99ak070r02smphdl75h5i'
	});
}

// iNaturalist API
function iNaturalist(lat, lng) {

	console.log("naturalist", lat, lng);

	var radius = 20;

	var speciesQueryURL = "https://api.inaturalist.org/v1/observations/"
		+ "species_counts?photos=true&radius="
		+ radius + "&lat=" + lat + "&lng=" + lng;

	var histogramQueryURL = "https://api.inaturalist.org/v1/observations/histogram?lat="
		+ lat + "&lng=" + lng + "&radius=" + radius
		+ "&date_field=observed&interval=month_of_year";

	$.ajax({
		url: speciesQueryURL,
		method: 'GET'
	}).done(function(response) {

		species = response.results;

		var imageURL = species[0].taxon.default_photo.medium_url;
		var linkURL = species[0].taxon.default_photo.url;
		var count = species[0].count;
		var taxon = species[0].taxon.name;
		var name = species[0].taxon.preferred_common_name;

		$("#wild-img").attr("src", imageURL);
		$("#wild-img").data("index", 0);
		$("#wild-link").attr("href", linkURL);
		$("#count").text(count);
		$("#taxon").text(taxon);
		$("#name").text(name);


		$("#right").on("click", function next() {
			console.log(species.length);


			var i = $("#wild-img").data("index");

			if (i < species.length) {
				i ++;

				var imageURL = species[i].taxon.default_photo.medium_url;
				var linkURL = species[i].taxon.default_photo.url;
				var count = species[i].count;
				var taxon = species[i].taxon.name;
				var name = species[i].taxon.preferred_common_name;

				$("#wild-img").attr("src", imageURL);
				$("#wild-img").data("index", i);
				$("#wild-link").attr("href", linkURL);
				$("#count").text(count);
				$("#taxon").text(taxon);
				$("#name").text(name);
			}
		})

		$("#left").on("click", function previous() {
			console.log("prev");

			var i = $("#wild-img").data("index");

			if (i > 0) {
				i --;

				var imageURL = species[i].taxon.default_photo.medium_url;
				var linkURL = species[i].taxon.default_photo.url;
				var count = species[i].count;
				var taxon = species[i].taxon.name;
				var name = species[i].taxon.preferred_common_name;

				$("#wild-img").attr("src", imageURL);
				$("#wild-img").data("index", i);
				$("#wild-link").attr("href", linkURL);
				$("#count").text(count);
				$("#taxon").text(taxon);
				$("#name").text(name);
			}
		})

	});

	$.ajax({
		url: histogramQueryURL,
		method: 'GET'
	}).done(function(response) {

		var data = response.results.month_of_year;
		var dataArray = [];

		$.each(data, function(month, value) {
			dataArray.push(value);
		});

		histogram(dataArray);
	});
}

//Chartist API
function histogram(dataArray) {

	var labelsArray = [
		"Jan", "Feb", "Mar", "Apr",
		"May", "Jun", "Jul", "Aug",
		"Sep", "Oct", "Nov", "Dec"
	]

	new Chartist.Bar('.ct-chart', {
	  labels: labelsArray,
	  series: dataArray,
	}, {
	  distributeSeries: true
	});

}

// custom functions for get and set
// can be used more easily than built-in
// because they allow object or string values
function setLocalStorage(key, value) {

	localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {

	var result = JSON.parse(localStorage.getItem(key));
	return result;
}


