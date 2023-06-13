var cityInputEl = document.querySelector('#city');
var userFormEl = document.querySelector('#user-form');
var weatherContainerEl = document.querySelector('#weather-container');
var apiKey = 'dc0da443fe986652e8135f72eb865747'


var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var city = cityInputEl.value.trim();
  
    if (city) {
      getCityLatLong(city);
      cityInputEl.value = '';
    } else {
      weatherContainerEl.textContent = 'Please enter a city name';
    }
  };

var getCityLatLong = function (city) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            processCityLatLong(data, city);
          });
        } else {
          weatherContainerEl.textContent = 'ERROR :: ' + response.statusText;
        }
      })
      .catch(function (error) {
        weatherContainerEl.textContent = 'No cities found.';
      });
  };


  var processCityLatLong = function(data, city) {

    if (data.length === 0) {
      weatherContainerEl.textContent = 'No cities found.';
      return;
    }
    
      repoSearchTerm.textContent = searchTerm;
    
      for (var i = 0; i < repos.length; i++) {
        var repoName = repos[i].owner.login + '/' + repos[i].name;
    
        var repoEl = document.createElement('a');
        repoEl.classList = 'list-item flex-row justify-space-between align-center';
        repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);
    
        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;
    
        repoEl.appendChild(titleEl);
    
        var statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';
    
        if (repos[i].open_issues_count > 0) {
          statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
        } else {
          statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
    
        repoEl.appendChild(statusEl);
    
        repoContainerEl.appendChild(repoEl);
      }

  }

  userFormEl.addEventListener('submit', formSubmitHandler);