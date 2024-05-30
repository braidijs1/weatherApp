const cityInput = document.getElementById("cityInput");
const apiKey = "d224bb32afc7f5e4a786e81282ba56cb";
const searchButton = document.getElementById("searchButton");
const humidityText = document.getElementById("Humidity");
const windText = document.getElementById("Wind");
const pressureText = document.getElementById("Pressure");
const cityNameText = document.getElementById("cityNameText");
const temperatureText = document.getElementById("temperatureText");
const currentWeather = document.querySelector(".current-weather");
const weatherDetails = document.querySelector(".weather-details");
const forecast = document.querySelector(".forecast");
const weatherIconHTML = document.querySelector(".weather-icon");
const umbrellaButton = document.getElementById("umbrellaButton");
const descriptionText = document.getElementById("descriptionText");
const modal = document.getElementById("myModal");
const weatherAppDiv = document.querySelector(".weather-app");
let weatherIcon = "";
let fiveDayForecastData = "";
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let data;
async function fetchWeatherData(cityName) {
    try {
        weatherAppDiv.style.display = "none";
        document.getElementById("loader").style.display = "block"; // Show loader
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
         data = await response.json();
        console.log(data);
        weatherIconHTML.src = checkWeatherIcon(data);
        humidityText.textContent = `${data.main.humidity}%`;
        windText.textContent = `${data.wind.speed} KM/S`;
        pressureText.textContent = `${data.main.pressure} hPa`;
        cityNameText.textContent = data.name;
        temperatureText.textContent = `${Math.floor(data.main.temp - 273.15)}°C`;
        descriptionText.textContent = data.weather[0].description.toUpperCase();
        weatherDetails.style.display = "flex";
    } catch (error) {
    
      
    } finally {
        document.getElementById("loader").style.display = "none"; // Hide loader
        weatherAppDiv.style.display = "block";
      
         if(
            data   
         ) {  currentWeather.style.display = "block";}
       
      
    }
}

async function fetch5DayForecast(cityName) {
    try {
        document.getElementById("loader").style.display = "block"; // Show loader
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        fiveDayForecastData = await response.json();

        forecast.innerHTML = "";
        fiveDayForecastData.list.forEach(element => {
            if (element.dt_txt.includes("12:00:00")) {
                weatherIcon = checkWeatherIcon(element);
                console.log(weatherIcon);
                console.log(element.weather[0].id);
                let d = new Date(element.dt_txt);
                forecast.innerHTML += `
                  <div class="forecast-day">
                    <p>${weekday[d.getDay()]}</p>
                    <img src="${weatherIcon}" alt="Weather Icon" class="forecast-icon">
                    <p>${Math.floor(element.main.temp - 273.15)}°C</p>
                  </div>
                `;
            }
        });

        forecast.style.display = "flex";
    } catch (error) {
        alert(error.message);

    } finally {
        document.getElementById("loader").style.display = "none"; // Hide loader
    }
}

searchButton.addEventListener("click", () => {
    const cityName = cityInput.value;
    fetchWeatherData(cityName);
    fetch5DayForecast(cityName);
});

function checkWeatherIcon(element) {
    switch (true) {
        case (element.weather[0].id < 300):
            return "https://openweathermap.org/img/wn/11d@2x.png";
        case (element.weather[0].id >= 300 && element.weather[0].id < 500):
            return "https://openweathermap.org/img/wn/09d@2x.png";
        case (element.weather[0].id >= 500 && element.weather[0].id < 600):
            return "https://openweathermap.org/img/wn/10d@2x.png";
        case (element.weather[0].id >= 600 && element.weather[0].id < 700):
            return "https://openweathermap.org/img/wn/13d@2x.png";
        case (element.weather[0].id >= 700 && element.weather[0].id < 800):
            return "https://openweathermap.org/img/wn/50d@2x.png";
        case (element.weather[0].id == 800):
            return "https://openweathermap.org/img/wn/01d@2x.png";
        default:
            return "https://openweathermap.org/img/wn/04d@2x.png";
    }
}

function umbrellaFunction() {
    let rain;
    modal.style.display = "block";
    console.log(fiveDayForecastData);
    for (let x = 0; x < fiveDayForecastData.list.length; x++) {
        if (!fiveDayForecastData.list[x].dt_txt.includes("00:00:00")) {
            if (fiveDayForecastData.list[x].weather[0].description.includes("rain")) {
                rain = true;
                modal.innerHTML = `<div class="forecast-day">
                <h1>You're going to need an umbrella today!</h1>
                </div>`;
                console.log(x);
                break;
            }
        } else {
            modal.innerHTML = `<div class="forecast-day">
            <h1>You won't need an umbrella today!</h1>
            </div>`;
            console.log(x);
            break;
        }
    }
}

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
