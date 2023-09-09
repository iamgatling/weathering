const apiKey = '421f078750fc9629a0affa8bd80ce29f';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const geolocationButton = document.getElementById('geolocation-button');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const historyList = document.getElementById('history');

searchButton.addEventListener('click', () => {
    const city = searchInput.value;
    if (city) {
        fetchWeatherData(city);
    }
});

geolocationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeatherDataByCoords(latitude, longitude);
        });
    } else {
        alert('Geolocation is not available in your browser.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
});

function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function fetchWeatherDataByCoords(latitude, longitude) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayCurrentWeather(data) {
    const temperature = (data.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherIcon = data.weather[0].icon;

    currentWeather.innerHTML = `
        <h2>Current Weather</h2>
        <div>Temperature: ${temperature}°C</div>
        <div>Humidity: ${humidity}%</div>
        <div>Wind Speed: ${windSpeed} m/s</div>
        <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
    `;
}

function displayWeatherForecast(data) {
    const forecastList = data.list;
    forecast.innerHTML = `<h2>5-Day Weather Forecast</h2>`;
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000); // Convert timestamp to date
        const maxTemp = item.main.temp_max;
        const minTemp = item.main.temp_min;
        const weatherIcon = item.weather[0].icon;

        forecast.innerHTML += `
            <div class="forecast-item">
                <div>${date.toDateString()}</div>
                <div>Max Temp: ${maxTemp}°C</div>
                <div>Min Temp: ${minTemp}°C</div>
                <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
            </div>
        `;
    });
}

function loadSearchHistory() {
    const historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];

    if (historyData.length === 0) {
        historyList.innerHTML = '<p>No search history available.</p>';
    } else {
        historyList.innerHTML = '<h2>Search History</h2>';
        const ul = document.createElement('ul');
        historyData.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            ul.appendChild(li);
        });
        historyList.appendChild(ul);
    }
}