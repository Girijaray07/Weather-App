const weatherCondition = weatherData.weather[0].main.toLowerCase(); 

const body = document.body;

function updateBackground(condition) {
    if (condition.includes("clear")) {
        body.className = "sunny";
    } else if (condition.includes("cloud")) {
        body.className = "cloudy";
    } else if (condition.includes("rain")) {
        body.className = "rainy";
    } else if (condition.includes("snow")) {
        body.className = "snowy";
    } else {
        body.className = "clear";
    }
}