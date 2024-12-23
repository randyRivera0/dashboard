import React from "react";
import { Grid } from "@mui/material";
import CurrentWeatherDetails from "./CurrentWeatherDetails";
import Indicator from "../interfaces/Indicator";

interface CurrentWeatherSectionProps {
  indicators: Indicator[];
  chartData: {
    temperature: number[];
    precipitation: number[];
    humidity: number[];
  };
  currentCity: string;
}

const CurrentWeatherSection: React.FC<CurrentWeatherSectionProps> = ({
  indicators,
  chartData,
  currentCity,
}) => {
  const symbolName = String(
    indicators.find((i) => i.subtitle === "Weather Symbol")?.value || "N/A"
  );
  const temperature = chartData.temperature[0]?.toFixed(1) || "N/A";
  const precipitation = chartData.precipitation[0]?.toFixed(1) || "N/A";
  const humidity = chartData.humidity[0]?.toFixed(1) || "N/A";
  const wind = "10"; // Replace with actual wind data from XML
  const latitude = String(
    indicators.find((i) => i.subtitle === "Latitude")?.value || "N/A"
  );
  const longitude = String(
    indicators.find((i) => i.subtitle === "Longitude")?.value || "N/A"
  );
  const altitude = String(
    indicators.find((i) => i.subtitle === "Altitude")?.value || "N/A"
  );

  return (
    <Grid item xs={12} xl={8}>
      <CurrentWeatherDetails
        symbolName={symbolName}
        temperature={temperature}
        precipitation={precipitation}
        humidity={humidity}
        wind={wind}
        day={new Date().toLocaleDateString("en-US", { weekday: "long" })}
        hour={new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
        city={currentCity}
        country={"Country"} // Replace with actual country data from XML
        latitude={latitude}
        longitude={longitude}
        altitude={altitude}
      />
    </Grid>
  );
};

export default CurrentWeatherSection;
