import React from "react";
import { Grid } from "@mui/material";
import ControlWeather from "./ControlWeather";

interface ControlWeatherSectionProps {
  setSelectedVariable: (variable: string) => void;
}

const ControlWeatherSection: React.FC<ControlWeatherSectionProps> = ({
  setSelectedVariable,
}) => (
  <Grid
    item
    xs={12}
    xl={4}
    container
    justifyContent="center"
    alignItems="center"
  >
    <ControlWeather setSelectedVariable={setSelectedVariable} />
  </Grid>
);

export default ControlWeatherSection;
