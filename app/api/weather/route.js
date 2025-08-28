// app/api/weather/route.js
export async function GET(request) {
  // 1) read ?city from the URL
  const { searchParams } = new URL(request.url);
  const cityRaw = searchParams.get("city");
  if (!cityRaw) {
    return Response.json({ error: "Missing city name" }, { status: 400 });
  }

  // 2) OpenWeather key (from .env.local)
  const apiKey = process.env.OWM_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server missing OWM_API_KEY" },
      { status: 500 }
    );
  }

  // 3) build request URL
  const city = encodeURIComponent(cityRaw.trim());
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // 4) call OpenWeather
    const res = await fetch(url);
    const data = await res.json(); // OpenWeather returns JSON

    if (res.ok) {
      // 5) return only what the UI needs
      return Response.json({
        name: data.name, // "Waterloo"
        country: data.sys?.country, // "CA"
        temp: Math.round(data.main?.temp), // °C
        feels_like: Math.round(data.main?.feels_like),
        desc: data.weather?.[0]?.description, // "scattered clouds"
        icon: data.weather?.[0]?.icon, // "03d"
        humidity: data.main?.humidity, // %
        wind: Math.round((data.wind?.speed ?? 0) * 3.6), // km/h (m/s → km/h)
        visibility: data.visibility != null ? data.visibility / 1000 : null, // km
        dt: data.dt, // UTC timestamp (seconds)
        timezone: data.timezone, // offset from UTC in seconds (e.g. -14400)
      });
    }

    // 6) bubble up API error
    return Response.json(
      { error: data?.message || "OpenWeather failed" },
      { status: res.status }
    );
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
