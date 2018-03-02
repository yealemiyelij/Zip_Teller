     var typeArray = [];
     var typeHospital = 0;
     var typeEntertainment  = 0;
     var typeSports = 0;
     var typeEducation = 0;

    var config = {
    apiKey: "AIzaSyDTi0mqr4lFFFzOum07o2hjZQcdeisUt50",
    authDomain: "ziptellall.firebaseapp.com",
    databaseURL: "https://ziptellall.firebaseio.com",
    projectId: "ziptellall",
    storageBucket: "ziptellall.appspot.com",
    messagingSenderId: "383885543793"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();



      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
    $(document).ready(function(){

  
      var long = "";
      var lat  = "";
      var zip  = "";
      var metricZip= "";
      var filter = [];




//retrieves the initial data.
database.ref().orderByChild("dateAdded").on("child_added", function(payload) {

 }) // end db.ref

  
    $("#zip-finder").on("click",getData);
    // $("#pushButton").on("click",getMetricData);

//    $("#zip-finder").on("click",getMetricData);

      function getData(){
        
        $("#map-canvas").empty();
        
        zip = $("#zipCode").val().trim();
      
        
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&key=AIzaSyDaPZ5HfKbDDaPol5zPsE7-zvfUopTe41I";

        $.ajax({
         url: url ,
         method: "GET"
        }).done(function(payload){
        console.log(payload);
        lat = payload.results[0].geometry.location.lat;
        long  = payload.results[0].geometry.location.lng
        initMap(lat,long,zip);

        }).fail(function(){
        
        })// end ajax
         //getMetricData(zip); 
         getMetricData();  
      }// end getData

      })// end ready

      var map;
      var service;
      var infowindow;





      function initMap(passLat, passLong, passZip) {
        
        var uluru = {lat: passLat, lng: passLong};
        map = new google.maps.Map(document.getElementById("map-canvas"), {
          center: uluru,
          zoom: 12
        });

        var hospitalRequest = {
          location: uluru,
          radius: '500',
          query: "hospital"
        };

        var schoolRequest = {
          location: uluru,
          radius: '500',
          query: "school"
        };

        var entertainmentRequest = {
          location: uluru,
          radius: '500',
          query: "entertainment"
        };

        var amusementRequest = {
          location: uluru,
          radius: '500',
          query: "amusement"
        };

        var clubRequest = {
          location: uluru,
          radius: '500',
          query: "club"
        };

        var theaterRequest = {
          location: uluru,
          radius: '500',
          query: "cinema"
        };

        var musicRequest = {
          location: uluru,
          radius: '500',
          query: "music"
        };

        var mallRequest = {
          location: uluru,
          radius: '500',
          query: "mall"
        };

        var venueRequest = {
          location: uluru,
          radius: '500',
          query: "venue"
        };

        var parkRequest = {
          location: uluru,
          radius: '500',
          query: "parks"
        };

        // adding type iterators for the push to the firebase db
        service = new google.maps.places.PlacesService(map);
        if($("#hospital_checked").is(":checked")){  
          service.textSearch(hospitalRequest, callback);
          typeHospital = 1;
        };

        if($("#school_checked").is(":checked")){  
          service.textSearch(schoolRequest, callback);
          typeEducation  = 1;
        };

        if($("#entertainment_checked").is(":checked")){  
          service.textSearch(entertainmentRequest, callback);
          service.textSearch(amusementRequest, callback);
          service.textSearch(clubRequest, callback);
          service.textSearch(theaterRequest, callback);
          service.textSearch(musicRequest, callback);
          service.textSearch(mallRequest, callback);
          service.textSearch(venueRequest, callback);
          typeEntertainment = 1;

        };

        if($("#park_checked").is(":checked")){  
          service.textSearch(parkRequest, callback);
          typeSports = 1;
        };


          typeArray.push(typeHospital);
          typeArray.push(typeEducation);
          typeArray.push(typeEntertainment);
          typeArray.push(typeSports);

        infowindow = new google.maps.InfoWindow();

        console.log("type array " + typeArray);

        // setting counts to firebase
        loadFirebase(passZip,typeArray);
      } // end initMap

      function loadFirebase(passZip,passTypeArray){

                  // getting data from firebase for metrics
          // getMetricData(passZip);


        //adding info to db
        console.log("to load " + passZip + " " + passTypeArray[0]);

        database.ref().push({
            passZip: passZip,
            typeHosp: passTypeArray[0],
            typeEduc: passTypeArray[1],
            typeEnte: passTypeArray[2],
            typeSprt: passTypeArray[3],
            dateAdded: firebase.database.ServerValue.TIMESTAMP
          });


     
      } // end loadFirebase

      function callback(results, status) {
        
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            
            createMarker(results[i]);
          }
        }
      }// end callBack

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        console.log("search is:" + service.textSearch);
        console.log("type is:" + place.types.indexOf("hospital"));
        if(place.types.indexOf("hospital") > -1 || place.types.indexOf("health") > -1){
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: iconBase + 'hospitals_maps.png'
          });
        };
        if(place.types.indexOf("park") > -1){
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: iconBase + 'picnic_maps.png'
          });
        };
        if(place.types.indexOf("school") > -1){
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: iconBase + 'schools_maps.png'
          });
        };
        if(place.types.indexOf("amusement_park") > -1){
          console.log("entertainment works");
          console.log(place);
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: iconBase + 'arts_maps.png'
          });
        };
        if(place.types.indexOf("night_club") > -1){
          console.log("entertainment works");
          console.log(place);
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: iconBase + 'arts_maps.png'
          });
        };
        if(place.types.indexOf("bar") > -1){
          console.log("entertainment works");
          console.log(place);
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: iconBase + 'arts_maps.png'
          });
        };


        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name + '<br>' + place.formatted_address);
          console.log(place);
          infowindow.open(map, this);
        });
      } //end createMarker()


      // getting firebase data for the zip..and 
// graphing it
function getMetricData(){
  metricZip = $("#zipCode").val().trim();
var numOneTotal = 0;
var numTwoTotal = 0;
var numThreeTotal = 0;
var numFourTotal = 0;
var ref = database.ref();
var keyCount = 0;
var typeCountArray = [];

 ref.orderByChild("passZip").equalTo(metricZip).on("child_added", function(snapshot) {

  keyCount++;
  numOneTotal   = numOneTotal + snapshot.val().typeEduc;
  numTwoTotal   = numTwoTotal + snapshot.val().typeEnte;
  numThreeTotal = numThreeTotal + snapshot.val().typeHosp;
  numFourTotal  = numFourTotal + snapshot.val().typeSprt;
  //console.log("from getmetric data" + numOneTotal);

});


typeCountArray.push(numOneTotal);
typeCountArray.push(numTwoTotal);
typeCountArray.push(numThreeTotal);
typeCountArray.push(numFourTotal);

console.log("tpe count array " + typeCountArray);
setMetricSparklines(typeCountArray);

}// end  getMetricData


function setMetricSparklines(passArray){

var ctx = document.getElementById("myMetricChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Schools",  "Entertainment", "Hospitals", "Sports"],
        datasets: [{
            label: 'List of Types',
            data: passArray,
            //data: [1, 19, 3, 5, 2, 3],
             backgroundColor: [
                 'rgba(54, 162, 235, 0.8)',
                 'rgba(255, 99, 132, 0.8)',
                 'rgba(255, 206, 86, 0.8)',
                 'rgba(75, 192, 192, 0.8)'
                 // 'rgba(153, 102, 255, 0.2)',
                 // 'rgba(255, 159, 64, 0.2)'
             ],
             borderColor: [
                 'rgba(54, 162, 235, 1)',
                 'rgba(255,99,132,1)',
                 'rgba(255, 206, 86, 1)',
                 'rgba(75, 192, 192, 1)'
                 // 'rgba(153, 102, 255, 1)',
                 // 'rgba(255, 159, 64, 1)'
             ],
            borderWidth: 1
        }]
    },
 options: {

            // onClick: handleClick,

            scales: {
                xAxes: [{
                    // barPercentage: .6,
                    barThickness: 25
                    // categoryPercentage: .5,
                    // samplePercentage: .7
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        // ,  
                        // steps: 5,
                        // stepValue: 1.5,
                        // max: 30,
                    }
                }]
            }
        }
});
}// end setMetricSparkLines
// function setMetricSparklines(passArray){
//    var ctx = document.getElementById("myChart").getContext('2d');
//     var myChart = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ["Men", "Women"],
//             datasets: [{
//                 label: 'Basic Population Demographics',
//                 data: popArray,
//                 backgroundColor: [
//                     'rgba(54, 162, 235, 0.8)',
//                     'rgba(255, 99, 132, 0.8)'
//                 ],
//                 borderColor: [
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255,99,132,1)'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {

//             // onClick: handleClick,

//             scales: {
//                 xAxes: [{
//                     // barPercentage: .6,
//                     barThickness: 25
//                     // categoryPercentage: .5,
//                     // samplePercentage: .7
//                 }],
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: true,
//                         // ,  
//                         // steps: 5,
//                         // stepValue: 1.5,
//                         // max: 30,
//                     }
//                 }]
//             }
//         }
//     }); // end  cjart
//   }