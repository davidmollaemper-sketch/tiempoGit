import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Estado

  const [weather, setWeather] = useState([]);
  const [city, setCity] = useState("Valencia");

  const API_KEY = process.env.REACT_APP_API_KEY;

  // Fetch Datos

  useEffect(() => {
    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&country=ES&days=16&lang=es&key=${API_KEY}`)
      .then(res => res.json())
      .then(data => setWeather(data.data));
  }, [city, API_KEY]);

  // Carga

    if (weather.length === 0) {
    return <p style={{ textAlign: "center" }}>Cargando...</p>;
  }

  // Calculos del maximo y minimo
  
  const hottest = Math.max(...weather.map(day => day.temp));
  const coldest = Math.min(...weather.map(day => day.temp));

  // Funciones
  
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const getColor = (temp) => {
    if (temp < 10) return "#74b9ff";   // temperatura fria
    if (temp < 20) return "#55efc4";   // temperatura media
    if (temp < 30) return "#ffeaa7";   // temperatura caliente
    return "#ff7675";                   // temperatura muy caliente
  };

  return (
    <div className="main">

     
      <h1>Tiempo en {city}</h1>

      
      <div className="top">
        <button onClick={() => setCity("Valencia")}>Valencia</button>
        <button onClick={() => setCity("Madrid")}>Madrid</button>
        <button onClick={() => setCity("Barcelona")}>Barcelona</button>
      </div>

      
      <div className="list">
        {weather.map((day, i) => {
          const isHottest = day.temp === hottest;
          const isColdest = day.temp === coldest;

          return (
            <div
              key={i}
              className={`box ${isHottest ? "hot" : ""} ${isColdest ? "cold" : ""}`}
              style={{ background: getColor(day.temp) }}
            >
              {/* Fecha */}
              <p className="day">{formatDate(day.datetime)}</p>

              <img
                src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`}
                alt="clima"
              />

              <p className="temp">{day.temp}°C</p>
              <p>{day.weather.description}</p>

              {isHottest && <span className="fire">🔥</span>}
              {isColdest && <span className="snow">❄️</span>}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default App;