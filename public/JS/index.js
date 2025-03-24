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

function getWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
    
                fetch("/getweather", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({lat, lon}),
                })
                .then((res) => {
                    console.log(res.status);
                    if (res.status === 200) {
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.error("Error getting weather:", error.message);
                });
            },
            (error) => {
                console.error("Error getting location:", error.message);
            }
        );
    } else {
        console.log("Geolocation is not available");
    }
}