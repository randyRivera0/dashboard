import React from "react";
import { Grid } from "@mui/material";

interface DailyWeatherCardsSectionProps {
  renderDailyCards: () => JSX.Element[];
}

const DailyWeatherCardsSection: React.FC<DailyWeatherCardsSectionProps> = ({
  renderDailyCards,
}) => (
  <Grid item xs={12}>
    <Grid container spacing={2} justifyContent="center">
      {renderDailyCards()}
    </Grid>
  </Grid>
);

export default DailyWeatherCardsSection;
