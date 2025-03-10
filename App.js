import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import ejs from "ejs";

dotenv.config();

const app = express();
const port  = 3000;
const OPENWEATHER_APIKEY = process.env.OPENWEATHER_APIKEY_MAIN;

app.use(express.urlencoded( { extended: true } ));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    const location = req.body.location;

    if (!(location)) {
        res.redirect("/");
    }
    
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_APIKEY}`);

        const data = response.data;
        const lat = data[0].lat;
        const lon = data[0].lon;
        const state = data[0].state;
        const country = data[0].country;

        console.log(lat, lon, location, state, country);

        const weather_response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);

        const weather_data = weather_response.data;
        console.log(weather_data);

        const timestamp = weather_data.dt;
        const timezoneOffset = weather_data.timezone;

        const localTime = new Date((timestamp + timezoneOffset) * 1000);

        // Format the date
        const formattedDate = localTime.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });

        res.render("index.ejs", {
            data : weather_data,
            location: location,
            state: state,
            country: country,
            date : formattedDate
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/submit", (req, res) => {
    res.render("index.ejs");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`http://localhost:${port}/`);
})