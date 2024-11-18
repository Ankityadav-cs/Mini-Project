const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const WeatherInfoSection = document.querySelector('.weather-info') 
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-item-container')

const apikey = '32d5e97e01f1f06a341288e1b387e110'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''  
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''  
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        showDisplaySection(notFoundSection);
        return null;
    }
}

function showDisplaySection(section) {
    [WeatherInfoSection, searchCitySection, notFoundSection]
        .forEach(s => s.style.display = 'none');
    section.style.display = 'flex';
}

// HAN YAHIN YAHIN HAI SAB ANIMATED WALE KE IF ELSE CASES
function getWeatherIcon(id) {  
    if (id <= 232) return 'thunderstorm.svg';  // thunderstorm  
    if (id <= 321) return 'drizzle.svg';  // drizzle  
    if (id <= 531) return 'rain.svg';  // rain  
    if (id <= 622) return 'snow.svg';  // snow  
    if (id <= 781) return 'atmosphere.svg';  // atmosphere  
    if (id === 800) return 'clear.svg';  // clear  
    return 'clouds.svg';  // clouds  
}  

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    
    return currentDate.toLocaleDateString('en-US', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (!weatherData || weatherData.cod !== 200) {  
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main}],
        wind: {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + ' %'
    windValueTxt.textContent = speed + ' M/s'

    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `files/weather/${getWeatherIcon(id)}`

    await updateForecastInfo(city)
    showDisplaySection(WeatherInfoSection)
}

async function updateForecastInfo(city) {  
    const forecastData = await getFetchData('forecast', city);  

    if (!forecastData || forecastData.cod !== '200') {  
        showDisplaySection(notFoundSection);  
        return;  
    }  

    const timeTaken = '12:00:00';  
    const todayDate = new Date().toISOString().split('T')[0];  

    // Clear previous forecast items
    forecastItemsContainer.innerHTML = '';

    forecastData.list.forEach(forecastWeather => {  
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {  
            updateForecastItems(forecastWeather);  
        }  
    });  
}  

function updateForecastItems(weatherData) {
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="files/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
    [WeatherInfoSection, searchCitySection, notFoundSection]
        .forEach(s => s.style.display = 'none')  

    section.style.display = 'flex'
}
