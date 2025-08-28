"use client";
import { useState } from "react";

// helper: turn OpenWeather's dt (UTC seconds) + timezone (offset seconds)
function cityLocalTime(dtSeconds, offsetSeconds) {
  const d = new Date((dtSeconds + offsetSeconds) * 1000);
  return d.toLocaleString(undefined, { timeZone: "UTC" });
}

// helper function to convert Celsius to Fahrenheit
function cToF(celsius) {
  return ((celsius * 9) / 5 + 32).toFixed(1); // rounded to 1 decimal
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getWeather() {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (res.ok) {
        setWeather(data);
      } else {
        setError(data.error || "Failed to fetch weather");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Weather Now</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather} disabled={loading}>
          {loading ? "..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="card">
          <h2>
            {weather.name}, {weather.country}
          </h2>

          <p className="today">Today</p>
          <p className="time">{cityLocalTime(weather.dt, weather.timezone)}</p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather icon"
          />
          <p className="temp">
            {weather.temp}°C / {cToF(weather.temp)}°F
          </p>
          <p className="desc">{weather.desc}</p>

          <div className="details">
            <div>
              <span> Humidity</span>
              <span>{weather.humidity}%</span>
            </div>
            <div>
              <span> Wind</span>
              <span>{Math.round(weather.wind)} km/h</span>
            </div>
            <div>
              <span> Visibility</span>
              <span>{weather.visibility} km</span>
            </div>
          </div>

          <div className="feels">
            <span> Feels like</span>
            <span>
              {weather.feels_like}°C / {cToF(weather.feels_like)}°F
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-text">
          <span className="name">Andrew Abu</span>
          <span className="copyright">© 2025</span>
        </div>
      </footer>
    </div>
  );
}
