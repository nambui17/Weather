var key = "742596242d7a6afa0b64df8f8698a248";
var searchInp = $('#sear');
var searchBtn = $('#searchBtn');
var currTemp= $('#currTemp');
var currWind = $('#currWind');
var currHumid = $('#currHumid');
var currFeel = $('#feels');
var currLoc = $('#loc');
var forecast = $('#forecast');
var saved = $('#savedLocations');
var saveArray=[];

//get Current weather function

//get the Weather function for five day forecast
function getFive(e) {
    //location url for geocoding dependent on the search value for the input
    //parameter passed into function is either the search bar value or the text of the button for search history
    var locUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + e + "&appid=" + key;
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
                    var date = new Date((currData.dt + currData.timezone)*1000).toLocaleDateString("en-US");
                    currLoc.text(currData.name + " " + date);
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
                            var date = new Date((fiveData.list[i].dt+fiveData.city.timezone)*1000).toLocaleDateString("en-US");
                            forecast.children().eq(i/8).children().children().eq(0).text(date);
                            forecast.children().eq(i/8).children().children().eq(1).text("");
                            forecast.children().eq(i/8).children().children().eq(2).text("Temp: " + fiveData.list[i].main.temp + "°F");
                            forecast.children().eq(i/8).children().children().eq(3).text("Wind: " + fiveData.list[i].wind.speed + " MPH");
                            forecast.children().eq(i/8).children().children().eq(4).text("Humidity: " + fiveData.list[i].main.humidity + "%");
                        } else if (i===39) {
                            //the addition of the fiveData.city.timezone is to correct for timezone
                            //The date converts the unix time stamp to normal time.
                            var date = new Date((fiveData.list[i].dt+fiveData.city.timezone)*1000).toLocaleDateString("en-US");
                            forecast.children().eq(4).children().children().eq(0).text(date);
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
      getFive(searchInp.val());
      saveAdd(searchInp.val());
    }
});

searchBtn.on('click',function() {
    getFive(searchInp.val());
    saveAdd(searchInp.val());
});

//function to populate the recent searches

function saveAdd(e) {
    console.log(saved.children().length)
    if (saved.children().length <= 10) {
        var newBtn = $('<button type="button" class="btn mb-4 mt-2 savedLoc"></button>');
        saved.append(newBtn);
        newBtn.text(e);
        saveArray.unshift(e);
        localStorage.setItem("saveArray",JSON.stringify(saveArray));
        //resets search field
        searchInp.val('');
    } else {
        //remove the first button that was
        $('#savedLocations button').first().remove();
        var newBtn = $('<button type="button" class="btn mb-4 mt-2 savedLoc"></button>');
        saved.append(newBtn);
        newBtn.text(e);
        saveArray.pop();
        saveArray.unshift(e);
        localStorage.setItem("saveArray",JSON.stringify(saveArray));
        searchInp.val('');
    }
}

//click event to recall function for buttons
saved.on('click','button',function() {
    var buttonText = $(this).text();
    getFive(buttonText);
})

// Loads button history for recently searched places
function loadHistory() {
    var saveLoc = JSON.parse(localStorage.saveArray);
    for (i=0; i<saveLoc.length; i++) {
        var newBtn = $('<button type="button" class="btn mb-4 mt-2 savedLoc"></button>');
        saved.append(newBtn);
        newBtn.text(saveLoc[i]);
    }
}

// Load local storage data if it there is an array in local storage.
if (JSON.parse(localStorage.saveArray).length !== 0) {
    loadHistory();
}