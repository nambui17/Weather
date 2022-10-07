var key = "742596242d7a6afa0b64df8f8698a248";
var searchInp = $('#sear');
var searchBtn = $('#searchBtn');
var currTemp= $('#currTemp');
var currWind = $('#currWind');
var currHumid = $('#currHumid');
var currFeel = $('#feels');
var currLoc = $('#loc');
var forecast = $('#forecast');

//get Current weather function

//get the Weather function for five day forecast
function getFive() {
    //location url for geocoding dependent on the search value for the input
    var locUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchInp.val() + "&appid=" + key;
    fetch(locUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            var lat=data[0].lat;
            var lng=data[0].lon;
            var fiveUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lng + "&appid=" + key + "&units=imperial";
            var currUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=" + key + "&units=imperial";
            fetch(currUrl)
                .then(function(currResponse) {
                    return currResponse.json();
                })
                .then(function(currData) {
                    currLoc.text(currData.name);
                    currTemp.text("Temp: " + currData.main.temp + "°F");
                    currFeel.text("Feels Like: " + currData.main.feels_like + "°F");
                    currWind.text("Wind Speed: " + currData.wind.speed + " MPH");
                    currHumid.text("Humidity: " + currData.main.humidity + "%");
                    console.log(currData);
                })
            fetch(fiveUrl)
                .then(function(fiveResponse) {
                    return fiveResponse.json();
                })
                .then(function(fiveData) {
                    console.log(fiveData);
                    //every 8 in list array is different day starting at 0
                    console.log(fiveData.list);
                    for (var i=0; i<39; i++) {
                        if (i%8===0 || i==0) {
                            forecast.children().eq(i/8).children().children().eq(0).text("");
                            forecast.children().eq(i/8).children().children().eq(1).text("");
                            forecast.children().eq(i/8).children().children().eq(2).text("Temp: " + fiveData.list[i].main.temp + "°F");
                            forecast.children().eq(i/8).children().children().eq(3).text("Wind: " + fiveData.list[i].wind.speed + " MPH");
                            forecast.children().eq(i/8).children().children().eq(4).text("Humidity: " + fiveData.list[i].main.humidity + "%");
                        } else if (i===39) {
                            forecast.children().eq(4).children().children().eq(0).text("");
                            forecast.children().eq(4).children().children().eq(1).text("");
                            forecast.children().eq(4).children().children().eq(2).text("Temp: " + fiveData.list[i].main.temp + "°F");
                            forecast.children().eq(4).children().children().eq(3).text("Wind: " + fiveData.list[i].wind.speed + " MPH");
                            forecast.children().eq(4).children().children().eq(4).text("Humidity: " + fiveData.list[i].main.humidity + "%");
                        }
                    }
                })
        })
}

searchInp.keydown(function(e) {
    if (e.which ==13) {
      getFive();
    }
});

searchBtn.on('click',function() {
    getFive();
});


