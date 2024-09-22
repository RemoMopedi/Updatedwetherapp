const API_KEY = "67b22bfd0873fef5abe098ef34469afe";

const cityDataUrl = "cities.json";
let cityData;

fetch(cityDataUrl)
  .then((response) => response.json())
  .then((data) => {
    cityData = data;
  })
  .catch((error) => console.error("Error fetching city data:", error));

async function fetchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("City not found. Please try again.");
    return null;
  }
}

async function displayWeather() {
  const cityInput = document.getElementById("city").value.trim().toLowerCase();
  if (cityInput === "") {
    alert("Please enter a city name.");
    return;
  }

  const weatherData = await fetchWeather(cityInput);
  if (!weatherData) return;

  document.getElementById(
    "cityName"
  ).textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  document.getElementById("temperature").textContent = weatherData.main.temp;
  document.getElementById("description").textContent =
    weatherData.weather[0].description;
  document.getElementById("windSpeed").textContent = weatherData.wind.speed;

  const iconCode = weatherData.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weatherIcon").src = iconUrl;
  document.getElementById("weatherIcon").alt =
    weatherData.weather[0].description;

  const attractionsList = document.getElementById("attractions");
  attractionsList.innerHTML = "";

  if (cityData[cityInput]) {
    cityData[cityInput].attractions.forEach((attraction) => {
      const li = document.createElement("li");
      li.textContent = attraction;
      attractionsList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No attractions found for this city.";
    attractionsList.appendChild(li);
  }

  document.getElementById("weatherDisplay").classList.remove("hidden");
}

document.getElementById("getWeather").addEventListener("click", displayWeather);

document.getElementById("city").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    displayWeather();
  }
});
