var cityInputEl = document.querySelector("#city");
var userFormEl = document.querySelector("#user-form");

var weatherContainerEl = document.querySelector("#weather-container");
var forecastContainerEl = document.querySelector("#forecast-container");

var historyContainerEl = document.querySelector("#history-buttons");
//Open Weather API Key
var apiKey = "dc0da443fe986652e8135f72eb865747";

var lat = "";
var lng = "";

// form submit event handler to process user entered city name
var formSubmitHandler = function (event) {
  event.preventDefault();
  forecastContainerEl.innerHTML = "";

  var city = cityInputEl.value.trim();

  if (city) {
    getCityLatLong(city);
    cityInputEl.value = "";
  } else {
    weatherContainerEl.textContent = "Please enter a city name";
  }
};

// Find city's lat long based on user input and save it localStorage for maintaining history
var getCityLatLong = function (city) {
  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          processCityLatLong(data, city);
        });
      } else {
        weatherContainerEl.textContent = "ERROR :: " + response.statusText;
      }
    })
    .catch(function (error) {
      weatherContainerEl.textContent = "No cities found for search criteria.";
    });
};

//Create display element for present day weather details
var createCurrentDayWeather = function (city, currentDayData) {
  // Create Card Div for current day weather content
  var cardEl = document.createElement("div");
  cardEl.classList = "card";
  // Create Card Header
  var cardHeaderEl = document.createElement("h3");
  cardHeaderEl.classList = "card-header";
  cardHeaderEl.textContent =
    city + " " + dayjs.unix(currentDayData.dt).format("MM/DD/YYYY");

  var iconEl = document.createElement("img");

  iconEl.setAttribute("alt", "Weather icon");
  iconEl.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" + currentDayData.weather[0].icon + ".png"
  );

  cardHeaderEl.appendChild(iconEl);
  cardEl.appendChild(cardHeaderEl);

  // Create Card Body Div
  var cardBodyEl = document.createElement("div");
  cardBodyEl.classList = "card-body";

  var cardDetails = document.createElement("p");

  // Convert from Kelvin to Fahrenheit
  let temp = Math.round(((currentDayData.main.temp - 273.15) * 9) / 5 + 32);

  // Covert meter/sec to Miles per hour
  let speed = Math.round(currentDayData.wind.speed * 2.237 * 2) / 2;

  cardDetails.innerHTML =
    "Temp " +
    temp +
    "&deg;F <br> Wind " +
    Math.round(currentDayData.wind.speed * 2.237 * 2) / 2 +
    " MPH <br> Humidity " +
    currentDayData.main.humidity +
    " %";
  cardBodyEl.appendChild(cardDetails);

  cardEl.appendChild(cardBodyEl);
  weatherContainerEl.appendChild(cardEl);
};

//Create display element for 5 day weather forecast
var createForecastCard = function (currentDayData) {
  // Create Card Div for current day weather content
  let cardEl = document.createElement("div");
  cardEl.classList = "card flex-column col-auto";
  // Create Card Header
  let cardHeaderEl = document.createElement("h3");
  cardHeaderEl.classList = "card-header";
  cardHeaderEl.textContent = dayjs.unix(currentDayData.dt).format("MM/DD/YYYY");
  cardEl.appendChild(cardHeaderEl);

  // Create Card Body Div
  let cardBodyEl = document.createElement("div");
  cardBodyEl.classList = "card-body";

  var iconEl = document.createElement("img");

  iconEl.setAttribute("alt", "Weather icon");
  iconEl.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" + currentDayData.weather[0].icon + ".png"
  );

  cardBodyEl.appendChild(iconEl);

  let cardDetails = document.createElement("p");

  // Convert from Kelvin to Fahrenheit
  let temp = Math.round(((currentDayData.main.temp - 273.15) * 9) / 5 + 32);

  // Covert meter/sec to Miles per hour
  let speed = Math.round(currentDayData.wind.speed * 2.237 * 2) / 2;

  cardDetails.innerHTML =
    "Temp " +
    temp +
    "&deg;F <br> Wind " +
    Math.round(currentDayData.wind.speed * 2.237 * 2) / 2 +
    " MPH <br> Humidity " +
    currentDayData.main.humidity +
    " %";
  cardBodyEl.appendChild(cardDetails);

  cardEl.appendChild(cardBodyEl);
  forecastContainerEl.appendChild(cardEl);
};

//Get weather content using Open Weather Map api
var getWeatherContent = function (lat, lng) {
  weatherContainerEl.innerHTML = "";
  forecastContainerEl.innerHTML = "";

  var apiForecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lng +
    "&appid=" +
    apiKey;

  fetch(apiForecastUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          // Display current day weather
          createCurrentDayWeather(data.city.name, data.list[0]);

          let previousDate = dayjs.unix(data.list[0].dt).format("YYYY-MM-DD");

          //Display forecast label
          let cardEl = document.createElement("div");
          cardEl.classList = "flex-row col-auto";
          cardEl.innerHTML = "<h3>5 Day Forecast:<h3><hr/><br>";
          weatherContainerEl.appendChild(cardEl);

          for (var i = 0; i < data.list.length; i++) {
            let currentDate = dayjs.unix(data.list[i].dt).format("YYYY-MM-DD");

            if (previousDate != currentDate) {
              console.log(data.list[i]);
              previousDate = currentDate;
              createForecastCard(data.list[i]);
            }
          }
        });
      } else {
        weatherContainerEl.textContent =
          "Unable to get weather forecast data !!!";
      }
    })
    .catch(function (error) {
      weatherContainerEl.textContent =
        "Unable to get weather forecast data !!!";
    });
};

// Funtion to set active content and find weather content based on lat/long for given city
var processCityLatLong = function (data, city) {
  for (const elIndex in historyContainerEl.children) {
    let buttonEl = historyContainerEl.children[elIndex];
    if (buttonEl.classList && buttonEl.classList.contains("active")) {
      buttonEl.classList.toggle("active");
    }
  }

  if (data.length === 0) {
    weatherContainerEl.textContent = "No cities found for search criteria.";
    return;
  }

  let lat = data[0].lat;
  let lng = data[0].lon;

  if (!weatherSearch[String(data[0].name)]) {
    createHistoryButton(lat, lng, String(data[0].name), true);
  } else {
    for (const elIndex in historyContainerEl.children) {
      let buttonEl = historyContainerEl.children[elIndex];

      if (
        buttonEl.classList &&
        buttonEl.dataset.city === String(data[0].name)
      ) {
        buttonEl.classList.toggle("active");
      }
    }
  }

  //weatherSearch object create as part of localStorage retrieval
  weatherSearch[String(data[0].name)] = { lat: lat, lon: lng };
  localStorage.setItem("weatherSearchData", JSON.stringify(weatherSearch));

  getWeatherContent(lat, lng);
};

//Function to generate history button for each previous searched city
var createHistoryButton = function (lat, lon, city, isActive) {
  let buttonEl = document.createElement("button");
  buttonEl.classList = "btn";
  buttonEl.setAttribute("data-lat", lat);
  buttonEl.setAttribute("data-lon", lon);
  buttonEl.setAttribute("data-city", city);
  buttonEl.innerText = city;

  buttonEl.addEventListener("click", buttonClickHandler);

  if (isActive) {
    buttonEl.classList.toggle("active");
  }

  historyContainerEl.appendChild(buttonEl);
};

var buttonClickHandler = function (event) {
  //disable active button
  for (const elIndex in historyContainerEl.children) {
    let buttonEl = historyContainerEl.children[elIndex];
    if (buttonEl.classList && buttonEl.classList.contains("active")) {
      buttonEl.classList.toggle("active");
    }
  }

  getWeatherContent(event.target.dataset.lat, event.target.dataset.lon);
};

//Look for localstorage for any previous search history and create action button for those cities
let weatherSearch = JSON.parse(localStorage.getItem("weatherSearchData"));
historyContainerEl.innerHTML = "";

if (weatherSearch) {
  for (const key in Object.keys(weatherSearch)) {
    let city = Object.keys(weatherSearch)[key];
    let coordObj = weatherSearch[city];
    console.log(city, coordObj.lat, coordObj.lon);

    createHistoryButton(coordObj.lat, coordObj.lon, city);
  }
} else {
  weatherSearch = {};
}

//form submit event listener.
userFormEl.addEventListener("submit", formSubmitHandler);
