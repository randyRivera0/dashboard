import React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

interface CurrentWeatherDetailsProps {
  symbolName: string;
  temperature: string;
  precipitation: string;
  humidity: string;
  wind: string;
  day: string;
  hour: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  altitude: string;
}

const CurrentWeatherDetails: React.FC<CurrentWeatherDetailsProps> = ({
  symbolName,
  temperature,
  precipitation,
  humidity,
  wind,
  day,
  hour,
  city,
  country,
  latitude,
  longitude,
  altitude,
}) => {
  return (
    <Grid container spacing={2} padding={2}>
      <Grid size={12}>
        <Typography variant="h5" gutterBottom>
          Current Weather Details
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Symbol:</strong> {symbolName}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Temperature:</strong> {temperature}°C
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Precipitation:</strong> {precipitation}%
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Humidity:</strong> {humidity}%
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Wind:</strong> {wind} km/h
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Day:</strong> {day}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Hour:</strong> {hour}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>City:</strong> {city}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Country:</strong> {country}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Latitude:</strong> {latitude}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Longitude:</strong> {longitude}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body1">
            <strong>Altitude:</strong> {altitude} m
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CurrentWeatherDetails;
