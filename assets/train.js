// Initialize Firebase
var config = {	
    apiKey: "AIzaSyCF9iPq3YJV6tWE0oTY6uuK6P3HzV7O9z0",
    authDomain: "train-activity-d8afe.firebaseapp.com",
    databaseURL: "https://train-activity-d8afe.firebaseio.com",
    storageBucket: "train-activity-d8afe.appspot.com",
    messagingSenderId: "391212582971"
  };

  firebase.initializeApp(config);

var database = firebase.database();

//Submit information input
$("#submit").on("click", function(event) {

	var train = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = $("#first-train").val().trim();
	var frequency = $("#frequency").val().trim();

//push information into database
	database.ref().push({
		train: train,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency
	});
});

//add children and calculate frequency using moment
database.ref().on("child_added", function(childSnapshot) {
	
	
	if (childSnapshot.val()){
		frequency = childSnapshot.val().frequency;

		var convertDate = moment(childSnapshot.val().firstTrain, 'hh:mm').subtract(3, 'months');
		var arrival = moment(convertDate).format('HH:mm');
		var currentTime = moment();

		var firstTimeConvert = moment(arrival, 'hh:mm').subtract(3, 'months');
		var differentTime = moment().diff(moment(firstTimeConvert), 'minutes');
		var timeRemain = differentTime % frequency;

		var minsAway = frequency - timeRemain;

		var nextTrain = moment().add(minsAway, 'minutes').format('HH:mm');

		$("#schedule").append("<tr><td>" + childSnapshot.val().train + "</td><td>" +
			childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + 
			"</td><td>" + arrival + "</td><td>" + minsAway + "</td><td>")
		}
	}, function(errorObject) {
			console.log("Errors handled: " + errorObject.code);
		});
