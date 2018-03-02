var cbKey = "798450708f2c2df7b46e9f9649008b2f510ef672";
var gmKey = "AIzaSyDaPZ5HfKbDDaPol5zPsE7-zvfUopTe41I";
var long = "";
var lat = "";
var ansi_city_name = '';
var ansi_id = '';
var fcc_fips = "";
var fcc_state = "";
var popArray = [];
var lookUpZip = "";


$(document).ready(function () {



    $("#zip-finder").on("click", getData);

    // function getData() {
    //     alert("that")
    //     lookUpZip = $("#zipCode").val();
    //     console.log(lookUpZip)


    //     // alert(nc_array.length)
    //     //var url = "https://maps.googleapis.com/maps/api/geocode/json?address=28105&key=AIzaSyDaPZ5HfKbDDaPol5zPsE7-zvfUopTe41I";
    //     var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + lookUpZip + "&key=" + gmKey;
    //     console.log(url);

    //     $.ajax({
    //         url: url,
    //         method: "GET"
    //     }).done(function (payload) {
    //         console.log("from getData");
    //         console.log(payload);
    //         lat = payload.results[0].geometry.location.lat;
    //         long = payload.results[0].geometry.location.lng;
    //         city = payload.results[0].address_components[1].long_name;
    //         state = payload.results[0].address_components[3].short_name;

    //         // console.log("from getData " + lat + " " + long)

    //         //initMap(lat,long)
    //         getPlaceID(city, state);
    //         //  getFIPS(lat, long, city );

    //     }).fail(function () {
    //         console.log("no joy");
    //     }) // end ajax
    // } // end getData

    function getFIPS(passLat, passLng, passCity) {
        var fccURL = "https://data.fcc.gov/api/block/find?latitude=" + passLat + "&longitude=" + passLng + "&showall=true&format=jsonp"; //alert("fcc url " + fccURL);
        // var fccURL = "https://data.fcc.gov/api/block/2010/find?latitude=40.0&longitude=-85&format=jsonp";
        //var fccUrl = "http://data.fcc.gov/api/block/find?latitude=39.9936&longitude=-105.0892&showall=false&format=json";

        $.ajax({
            url: fccURL,
            method: "GET",
            dataType: "jsonp"
            // call cack cann be called here..or as part of hte URL string.
            // jsonpCallback: "logResults"
            // jsonpCallback: "logResults"

        }).done(function (fipsPayload) {
            console.log("from fcc call");
            console.log(fipsPayload);
            // fcc_fips = fipsPayload.County.FIPS;
            fcc_state = fipsPayload.State.FIPS;
            ansi_id = getPlaceID()
            // ansi_id = getPlaceID(passCity, fcc_state);
            getDemoData(ansi_id, fcc_state);

        }) // end ajax/done

    } // end getFIPS

}) // end ready

function logResults(json) {
    console.log(json);
}


function getPlaceID(passCity, passState) {
    placeId = '';
    stateId = '';
    $.each(nc_array, function (i, val) {

        // $.each(val,function(j,innerVal){
        //   console.log(i  + "~~" + j + " " + innerVal);
        // })
        var holdFedState = val[0];
        var holdTown = val[3].split(" ");
        if ((passCity === holdTown[0]) && (passState === holdFedState)) {
            // if ((passCity === holdTown[0]) ){
            console.log("got match " + i + "~" + holdFedState + "~" + holdTown[0] + "~" + passState + "~" + passCity + "~" + "~" + val[2]);

            placeId = val[2];
            stateId = val[1];

        } // end  if

    }) // end each

    //return placeId;
    getDemoData(placeId, stateId);
}

function getDemoData(passPlaceId, passState) {
    var url = "https://api.census.gov/data/2013/acs1?get=NAME,B01001_002E,B01001_026E&for=place:" + passPlaceId + "&in=state:" + passState + "&key=" + cbKey;
    // var url = "https://api.census.gov/data/2013/acs1?get=NAME,B01001_001E,B01001_002E&for=place:50000&in=state:11&key="+cbKey;
    console.log(url);
    // console.log("from get domo data");
    //console.log(url);
    $.ajax({
        url: url,
        method: "GET"
    }).done(function (demoPayload) {
        console.log("get domo data")
        console.log(demoPayload);

        // pushes demographpic info into the array
        // 1st is men
        // 2nd is women
        popArray.push(demoPayload[1][1]);
        popArray.push(demoPayload[1][2]);

        if (popArray.length === 0) {
            $("#chartSpot").html("No  Demographic Information Available for " + lookUpZip);
        } else {
            setSparklines();
        }
    }).fail(function () {
        console.log("no joy");
    })


} // end getData

function initMap(passLat, passLong) {
    //      alert(passLat + " " + passLong);
    //        var uluru = {lat: -25.363, lng: 131.044};
    var uluru = {
        lat: passLat,
        lng: passLong
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        //        var map = new google.maps.Map($("#map"), {
        //					var map = new google.maps.Map($("#map"),{
        zoom: 14,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });

} // end initmap

function setSparklines() {

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Men", "Women"],
            datasets: [{
                label: 'Basic Population Demographics',
                data: popArray,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255,99,132,1)'
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
    }); // end  cjart
} // end function

//TONY weather function handles all weather data gathering and html calls
