import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState([]);
  const [city, setCity] = useState("Valencia");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);

      try {
        let lat = 39.4699;
        let lon = -0.3763;

        if (city === "Madrid") {
          lat = 40.4168;
          lon = -3.7038;
        }

        if (city === "Barcelona") {
          lat = 41.3851;
          lon = 2.1734;
        }

        const res = await fetch(
          `${API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FMadrid`
        );

        const data = await res.json();

        const formatted = data.daily.time.map((date, i) => ({
          datetime: date,
          temp: data.daily.temperature_2m_max[i],
          weather: {
            description: "Clima",
            icon: "c01d"
          }
        }));

        setWeather(formatted);

      } catch (error) {
        console.log("Error API:", error);
        setWeather([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, API_URL]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando...</p>;
  }


  if (!weather || weather.length === 0) {
    return <p style={{ textAlign: "center" }}>Sin datos disponibles</p>;
  }

  const hottest = Math.max(...weather.map(d => d.temp));
  const coldest = Math.min(...weather.map(d => d.temp));

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const getColor = (temp) => {
    if (temp < 10) return "#74b9ff";
    if (temp < 20) return "#55efc4";
    if (temp < 30) return "#ffeaa7";
    return "#ff7675";
  };

  return (
    <div className="main">

      <h1>Tiempo en {city}</h1>

      <div className="top">
        <button onClick={() => setCity("Valencia")}>Valencia</button>
        <button onClick={() => setCity("Madrid")}>Madrid</button>
        <button onClick={() => setCity("Barcelona")}>Barcelona</button>

        <button
          onClick={async () => {
            const prompt = window.deferredPrompt;
            if (prompt) {
              prompt.prompt();
              await prompt.userChoice;
              window.deferredPrompt = null;
            }
          }}
        >
          Instalar
        </button>
      </div>

      <div className="list">
        {weather.map((day, i) => {
          const isHot = day.temp === hottest;
          const isCold = day.temp === coldest;

          return (
            <div
              key={i}
              className={`box ${isHot ? "hot" : ""} ${isCold ? "cold" : ""}`}
              style={{ background: getColor(day.temp) }}
            >
              <p className="day">{formatDate(day.datetime)}</p>

              <img
                src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`}
                alt="clima"
              />

              <p className="temp">{day.temp}°C</p>
              <p>{day.weather.description}</p>

              {isHot && <span>🔥</span>}
              {isCold && <span>❄️</span>}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default App;