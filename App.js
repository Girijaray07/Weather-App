import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import ejs from "ejs";
import NodeGrocoder from "node-geocoder";

dotenv.config();

const app = express();
const port = 3000;
const OPENWEATHER_APIKEY = process.env.OPENWEATHER_APIKEY_MAIN;
const geocoder = NodeGrocoder({ provider: "openstreetmap" });

var weather_data, location, state, country, formattedDate, sunRise, sunSet = "";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

async function getWeatherData(lat, lon) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);

        weather_data = response.data;

        const timestamp = weather_data.dt;
        const timezoneOffset = weather_data.timezone;
        const localTime = new Date((timestamp + timezoneOffset) * 1000);
        formattedDate = localTime.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });

        const sunriseLocal = new Date(weather_data.sys.sunrise * 1000);
        const sunsetLocal = new Date(weather_data.sys.sunset * 1000);

        sunRise = sunriseLocal.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        sunSet = sunsetLocal.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    } catch (err) {
        console.error("Error fetching weather data:", err);
    }
};

app.get("/", (req, res) => {
    res.render("index.ejs", {
        data: weather_data,
        location: location,
        state: state,
        country: country,
        date: formattedDate,
        sunrise: sunRise,
        sunset: sunSet
    });
});

app.post("/submit", async (req, res) => {
    location = req.body.location;

    if (!(location)) {
        res.redirect("/");
    }

    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_APIKEY}`);

        const data = response.data;
        const lat = data[0].lat;
        const lon = data[0].lon;
        location = data[0].name;
        state = data[0].state;
        country = data[0].country;

        console.log(lat, lon, location, state, country + " - " + new Date().toLocaleTimeString());

        getWeatherData(lat, lon);

        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});

app.post("/getweather", async (req, res) => {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required." });
    }

    // console.log(lat, lon);
    try {
        getWeatherData(lat, lon);

        const location_response = await geocoder.reverse({ lat, lon });

        console.log(location_response[0]);

        location = location_response[0].formattedAddress.split(",")[0].trim();;
        state = location_response[0].state;
        country = location_response[0].country;

        console.log(lat, lon, location, state, country);

        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`http://localhost:${port}/`);
});