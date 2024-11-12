const apiKey = '58dfd61355f4290d7a0b3aa6b7c7ee1b'; 
let unit = 'metric'; 

function searchWeather() {
  const city = document.getElementById('city').value;
  if (city) {
    fetchWeatherData(city);
  }
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherDataByCoords(lat, lon);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function fetchWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      fetchForecastData(data.coord.lat, data.coord.lon);
    })
    .catch(error => alert('Error fetching weather data.'));
}

function fetchWeatherDataByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      fetchForecastData(lat, lon);
    })
    .catch(error => alert('Error fetching weather data.'));
}

function displayCurrentWeather(data) {
  document.getElementById('city-name').innerText = data.name;
  document.getElementById('current-temp').innerText = `Temperature: ${data.main.temp}°`;
  document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
  document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
  document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}


function fetchForecastData(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => alert('Error fetching forecast data.'));
}


function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; 

  data.list.forEach((forecast, index) => {
    if (index % 8 === 0) { 
      const forecastDiv = document.createElement('div');
      forecastDiv.className = 'forecast-day';
      forecastDiv.innerHTML = `
        <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="weather icon">
        <p>${forecast.main.temp}°</p>
      `;
      forecastContainer.appendChild(forecastDiv);
    }
  });
}


function toggleUnit() {
  unit = document.getElementById('unit').value;
  const city = document.getElementById('city').value;
  if (city) {
    fetchWeatherData(city);
  }
}
