import React from "react";
import { Grid } from "@mui/material";
import CurrentWeatherSection from "./CurrentWeatherSection";
import ControlWeatherSection from "./ControlWeatherSection";
import ChartWeatherSection from "./ChartWeatherSection";
import DailyWeatherCardsSection from "./DailyWeatherCardsSection";
import Indicator from "../interfaces/Indicator";

interface WeatherDashboardProps {
  indicators: Indicator[];
  chartData: {
    temperature: number[];
    precipitation: number[];
    humidity: number[];
    xLabels: string[];
  };
  series: any; // Replace with a more specific type if needed
  currentCity: string;
  setSelectedVariable: (variable: string) => void;
  renderDailyCards: () => JSX.Element[];
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  indicators,
  chartData,
  series,
  currentCity,
  setSelectedVariable,
  renderDailyCards,
}) => {
  return (
    <Grid container spacing={4} sx={{ padding: 3 }}>
      <CurrentWeatherSection
        indicators={indicators}
        chartData={chartData}
        currentCity={currentCity}
      />
      <ControlWeatherSection setSelectedVariable={setSelectedVariable} />
      <ChartWeatherSection chartData={chartData} series={series} />
      <DailyWeatherCardsSection renderDailyCards={renderDailyCards} />
    </Grid>
  );
};

export default WeatherDashboard;
