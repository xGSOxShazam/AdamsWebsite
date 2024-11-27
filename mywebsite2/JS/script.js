// Name Form Submission to Save and Display User's Name
document.getElementById('nameForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name) {
        localStorage.setItem('userName', name);
        nameInput.value = '';
        displayWelcomeMessage(); // Display updated welcome message with the name
    }
});

// Function to Get and Format Current Date and Time
function getCurrentDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: true });
    const date = now.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
    return { time, date };
}

// Save the Current Visit Time and Update Last Visit
function updateLastVisit() {
    const previousVisit = localStorage.getItem('currentVisit');
    if (previousVisit) {
        // Move the current visit time to 'lastVisit'
        localStorage.setItem('lastVisit', previousVisit);
    }
    // Save the new current visit time
    const { time, date } = getCurrentDateTime();
    const currentVisit = `${date} at ${time} EST`;
    localStorage.setItem('currentVisit', currentVisit);
}

// Display Last Visit Time
function displayLastVisit() {
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
        document.getElementById('lastVisit').textContent = `By the way, you last visited on ${lastVisit}.`;
    }
}

// Greet User Based on Time of Day
function greetUser(name) {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) return `Good morning, ${name}!`;
    if (hours < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
}

// Display Welcome Message with Weather Info and Greeting
async function displayWelcomeMessage() {
    const name = localStorage.getItem('userName') || 'Guest';
    const { time, date } = getCurrentDateTime();
    const weatherDescription = await fetchWeather();
    const greeting = greetUser(name);

    document.getElementById('welcomeMessage').innerHTML = `
        ${greeting} It's currently ${time} EST on ${date}, and it's ${weatherDescription} in Detroit, Michigan.
    `;

    displayLastVisit();
}

// Fetch Current Weather Data for Detroit, Michigan
async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=42.3314&longitude=-83.0458&current_weather=true');
        const data = await response.json();
        const weatherCode = data.current_weather.weathercode;
        return mapWeatherCodeToDescription(weatherCode);
    } catch (error) {
        console.error('Error fetching weather:', error);
        return 'unavailable';
    }
}

// Map Weather Codes to Descriptions
function mapWeatherCodeToDescription(code) {
    const weatherDescriptions = {
        0: 'clear sky',
        1: 'mainly clear',
        2: 'partly cloudy',
        3: 'overcast',
        45: 'fog',
        48: 'depositing rime fog',
        51: 'light drizzle',
        53: 'moderate drizzle',
        55: 'dense drizzle',
        61: 'light rain',
        63: 'moderate rain',
        65: 'heavy rain',
        71: 'light snow',
        73: 'moderate snow',
        75: 'heavy snow',
        80: 'slight rain showers',
        81: 'moderate rain showers',
        82: 'violent rain showers',
    };
    return weatherDescriptions[code] || 'unknown weather';
}

// Update Welcome Message Every Second
function updateWelcomeMessage() {
    setInterval(displayWelcomeMessage, 1000);
}

// Initial Call to Set Up the Welcome Message and Update Last Visit
updateLastVisit();           // Update last visit time on page load
displayWelcomeMessage();     // Display the welcome message
updateWelcomeMessage();      // Start the interval to update the welcome message every second
