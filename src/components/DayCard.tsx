import React from "react";

interface DayCardProps {
  day: string;
  minTemp: number;
  maxTemp: number;
  weatherSymbol: string;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  minTemp,
  maxTemp,
  weatherSymbol,
}) => {
  return (
    <div style={{ textAlign: "center", margin: "10px" }}>
      <h3>{day}</h3>
      <img
        src={`http://openweathermap.org/img/wn/${weatherSymbol}.png`}
        alt="Weather icon"
        style={{ width: "50px", height: "50px" }}
      />
      <p>Min: {minTemp.toFixed(1)}°C</p>
      <p>Max: {maxTemp.toFixed(1)}°C</p>
    </div>
  );
};

export default DayCard;
