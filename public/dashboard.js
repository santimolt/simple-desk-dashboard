function pad(n) {
  return n.toString().padStart(2, "0");
}

function updateTime() {
  const now = new Date();
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");
  if (timeEl) timeEl.textContent = `${h}:${m}:${s}`;
  if (dateEl)
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
}

function weatherCodeToText(code) {
  // simplified mapping from Open-Meteo weathercodes
  const map = {
    0: ["Clear", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    56: ["Light freezing drizzle", "🌧️"],
    57: ["Dense freezing drizzle", "🌧️"],
    61: ["Slight rain", "🌧️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    66: ["Light freezing rain", "🌧️"],
    67: ["Heavy freezing rain", "🌧️"],
    71: ["Slight snow fall", "🌨️"],
    73: ["Moderate snow fall", "🌨️"],
    75: ["Heavy snow fall", "❄️"],
    80: ["Rain showers", "🌦️"],
    81: ["Moderate showers", "🌦️"],
    82: ["Violent showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with slight hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"],
  };
  return map[code] || ["Unknown", "❓"];
}

async function fetchWeather(lat, lon) {
  const tempEl = document.getElementById("temperature");
  const climateEl = document.getElementById("climate");
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();
    const cw = data.current_weather;
    if (cw) {
      if (tempEl) tempEl.textContent = `${Math.round(cw.temperature)}°C`;
      const [desc, emoji] = weatherCodeToText(cw.weathercode);
      if (climateEl) climateEl.textContent = `${emoji} ${desc}`;
    } else {
      if (climateEl) climateEl.textContent = "No data";
    }
    // If weather API doesn't return a city, leave it untouched (IP lookup will set it)
  } catch (e) {
    if (climateEl) climateEl.textContent = "Weather error";
    console.error(e);
  }
}
async function getLocationFromIP() {
  // Try ipapi.co first, then ipwhois.app as fallback
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const j = await res.json();
      if (j) {
        const lat = j.latitude || j.lat || j.latitude;
        const lon = j.longitude || j.lon || j.longitude;
        const city = j.city || j.city;
        if (lat && lon) return { lat: Number(lat), lon: Number(lon), city: city || null };
      }
    }
  } catch (e) {
    console.info("ipapi.co lookup failed, trying fallback");
  }

  try {
    const res2 = await fetch("https://ipwhois.app/json/");
    if (res2.ok) {
      const j2 = await res2.json();
      if (j2 && j2.latitude && j2.longitude)
        return { lat: Number(j2.latitude), lon: Number(j2.longitude), city: j2.city || null };
    }
  } catch (e) {
    console.info("ipwhois.app lookup failed");
  }

  return null;
}

async function startWeather() {
  const fallback = { lat: 40.7128, lon: -74.006, city: "New York" };
  const cityEl = document.getElementById("city");
  const loc = await getLocationFromIP();
  if (loc) {
    if (cityEl && loc.city) cityEl.textContent = loc.city;
    fetchWeather(loc.lat, loc.lon);
  } else {
    console.info("IP lookup failed — using fallback.");
    if (cityEl) cityEl.textContent = fallback.city;
    fetchWeather(fallback.lat, fallback.lon);
  }
}

// Initialize
updateTime();
setInterval(updateTime, 1000);
startWeather();
// refresh weather every 10 minutes
setInterval(startWeather, 10 * 60 * 1000);
