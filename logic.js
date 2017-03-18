// Initialize Firebase
var config = {
    apiKey: "AIzaSyAZZg0FU5ycDBT4WxJWxc3i6mx9iwsJWJU",
    authDomain: "trainscheduler-97ea8.firebaseapp.com",
    databaseURL: "https://trainscheduler-97ea8.firebaseio.com",
    storageBucket: "trainscheduler-97ea8.appspot.com",
    messagingSenderId: "350977295816"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
database.ref().on("child_added", function(childSnapshot) {
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().firstTrain;
    var trainFreq = childSnapshot.val().frequency;

// Code for time calculations using moment
    var currentTime = moment();
    // console.log("Current time: " + currentTime + " & converted: " + moment(currentTime).format("hh:mm"));

    var convertedFreq = trainFreq * 60000;

    var firstTrainTime = moment().hour(trainFirst.substring(0,2)).minute(trainFirst.substring(3,5));
    // console.log("firstTrainTime " + firstTrainTime + " & converted: " + moment(firstTrainTime).format("hh:mm"));

    var minutesAway = convertedFreq - ((currentTime - firstTrainTime) % convertedFreq);
    // console.log("minutesAway: " + minutesAway);

    var convertedMinAway = Math.floor(minutesAway / 60000);
    // console.log("convertedMinAway: " + convertedMinAway);

    var nextArrival = currentTime + minutesAway;
    nextArrival = moment(nextArrival).format("hh:mm");
    // console.log("nextArrival: " + nextArrival);


    var newRow = $("<tr>")
        .append($("<td>").html(trainName))
        .append($("<td>").html(trainDest))
        .append($("<td>").html(trainFreq + " min"))
        .append($("<td>").html(nextArrival))
        .append($("<td>").html(convertedMinAway));


    $("#train-schedule").append(newRow);

})

//  Create button click event
$("#add-train").on("click", function() {

    event.preventDefault();

    var trainName = $("#trainName").val().trim();
    var trainDest = $("#trainDest").val().trim();
    var trainFirst = moment($("#trainFirst").val().trim(), "hh:mm").format("hh:mm");
    var trainFreq = Number($("#trainFreq").val().trim());

    // console.log(moment(trainFirst, "hh:mm"));

    // Input validation
    if (trainName.length !== 0) {
        var trainNameValid = true;
    }
    if (trainDest.length !== 0 && typeof(trainDest) === 'string') {
        var trainDestValid = true;
    }
    if (moment(trainFirst, "hh:mm").isValid()){
        var startTimeValid = true;
        // console.log("test: " + moment(trainFirst, "hh:mm").format("hh:mm"));
    } else {
        // console.log("else: " + moment(trainFirst, "hh:mm"))
    }
    if (typeof(trainFreq) === 'number') {
        var trainFreqValid = true;
    }
    // console.log("trainNameValid: " + trainNameValid);
    // console.log("trainDestValid: " + trainDestValid);
    // console.log("startTimeValid: " + startTimeValid);
    // console.log("trainFreqValid: " + trainFreqValid);


    if (trainNameValid && trainDestValid && startTimeValid && trainFreqValid) {

        // Create new train object
        var newTrain = {
            name: trainName,
            destination: trainDest,
            firstTrain: trainFirst,
            frequency: trainFreq,
        }

        // Code for push to database
        database.ref().push(newTrain);
    }

    $("#trainName").val("");
    $("#trainDest").val("");
    $("#trainFirst").val("");
    $("#trainFreq").val("");
})

console.log(database);