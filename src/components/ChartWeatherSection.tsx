import React from "react";
import { Grid } from "@mui/material";
import LineChartWeather from "./LineChartWeather";

interface ChartWeatherSectionProps {
  chartData: {
    xLabels: string[];
  };
  series: any; // Replace with a more specific type if needed
}

const ChartWeatherSection: React.FC<ChartWeatherSectionProps> = ({
  chartData,
  series,
}) => (
  <Grid item xs={12}>
    <LineChartWeather xLabels={chartData.xLabels} series={series} />
  </Grid>
);

export default ChartWeatherSection;
