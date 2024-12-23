import Grid from "@mui/material/Grid2";
import TableWeather from "./components/TableWeather";
import ControlWeather from "./components/ControlWeather";
import LineChartWeather from "./components/LineChartWeather";
import Indicator from "./interfaces/Indicator";
import { useEffect, useState } from "react";
import Item from "./interfaces/Item";
import "./App.css";
import SearchBar from "./components/SearchBar";
import DayCard from "./components/DayCard"; // Import DayCard
import CurrentWeatherDetails from "./components/CurrentWeatherDetails";
import WeatherDashboard from "./components/WeatherDashboard";

// Define the interface for props
interface AppProps {
  city: string;
}

function App({ city }: AppProps) {
  const [currentCity, setCurrentCity] = useState<string>(city || ""); // Set initial city if passed
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));
  const [items, setItems] = useState<Item[]>([]);
  const [chartData, setChartData] = useState<{
    xLabels: string[];
    precipitation: number[];
    temperature: number[];
    humidity: number[];
  }>({
    xLabels: [],
    precipitation: [],
    temperature: [],
    humidity: [],
  });
  const [selectedVariable, setSelectedVariable] =
    useState<string>("precipitation");
  // Add a new state for daily weather data
  const [dailyWeather, setDailyWeather] = useState<
    { day: string; minTemp: number; maxTemp: number; weatherSymbol: string }[]
  >([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");
      let nowTime = new Date().getTime();

      // Check if the weather data is expired or not available in localStorage
      if (
        expiringTime === null ||
        nowTime > parseInt(expiringTime) ||
        !savedTextXML ||
        currentCity !== localStorage.getItem("city")
      ) {
        const API_KEY = "5c39343e5c27e119e010125e99fa753a";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&mode=xml&appid=${API_KEY}`
        );
        savedTextXML = await response.text();
        console.log(savedTextXML);

        let hours = 0.01;
        let delay = hours * 3600000;
        let newExpiringTime = nowTime + delay;

        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", newExpiringTime.toString());
        localStorage.setItem("nowTime", nowTime.toString());
        localStorage.setItem(
          "expiringDateTime",
          new Date(newExpiringTime).toString()
        );
        localStorage.setItem("nowDateTime", new Date(nowTime).toString());

        setOWM(savedTextXML); // Update the weather data state
      } else {
        console.log("gotcha");
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        // Process the XML data and update the state
        let dataToIndicators: Indicator[] = [];
        let name = String(xml.getElementsByTagName("name")[0]?.innerHTML || "");
        dataToIndicators.push({
          title: "Location",
          subtitle: "City",
          value: name,
        });

        let location = xml.getElementsByTagName("location")[1];

        if (location) {
          // Ensure latitude is a primitive string
          let latitude = String(location.getAttribute("latitude") || "");
          dataToIndicators.push({
            title: "Location",
            subtitle: "Latitude",
            value: latitude,
          });

          // Ensure longitude is a primitive string
          let longitude = String(location.getAttribute("longitude") || "");
          dataToIndicators.push({
            title: "Location",
            subtitle: "Longitude",
            value: longitude,
          });

          // Ensure altitude is a primitive string
          let altitude = String(location.getAttribute("altitude") || "");
          dataToIndicators.push({
            title: "Location",
            subtitle: "Altitude",
            value: altitude,
          });
        }

        setIndicators(dataToIndicators);

        let dataToItems: Item[] = [];
        const xLabels: string[] = [];
        const precipitationData: number[] = [];
        const humidityData: number[] = [];
        const cloudsData: number[] = [];
        const temperatureData: number[] = [];

        const timeNodes = xml.getElementsByTagName("time");
        const dailyData: Record<
          string,
          { min: number; max: number; symbol: string }
        > = {};

        for (let i = 0; i < timeNodes.length; i++) {
          const timeNode = timeNodes[i];
          const dateStart = timeNode.getAttribute("from") || "";
          const dateEnd = timeNode.getAttribute("to") || "";
          const dateFrom = timeNode.getAttribute("from") || "";
          const day = new Date(dateFrom).toLocaleDateString("en-US", {
            weekday: "short",
          });
          xLabels.push(dateStart);

          const precipitationNode =
            timeNode.getElementsByTagName("precipitation")[0];
          const precipitation = parseFloat(
            precipitationNode?.getAttribute("probability") || "0"
          );
          precipitationData.push(precipitation);

          const humidityNode = timeNode.getElementsByTagName("humidity")[0];
          const humidity = parseFloat(
            humidityNode?.getAttribute("value") || "0"
          );
          humidityData.push(humidity);

          const cloudsNode = timeNode.getElementsByTagName("clouds")[0];
          const clouds = parseFloat(cloudsNode?.getAttribute("all") || "0");
          cloudsData.push(clouds);

          const temperatureNode =
            timeNode.getElementsByTagName("temperature")[0];
          const temperature = parseFloat(
            temperatureNode?.getAttribute("value") || "0"
          );
          temperatureData.push(temperature);
          /* 
          const temp = parseFloat(
            temperatureNode?.getAttribute("value") || "0"
          );
          */

          const minTemp = parseFloat(
            temperatureNode?.getAttribute("min") || "0"
          );
          const maxTemp = parseFloat(
            temperatureNode?.getAttribute("max") || "0"
          );

          const symbolNode = timeNode.getElementsByTagName("symbol")[0];
          const weatherSymbol = symbolNode?.getAttribute("var") || "";

          if (!dailyData[day]) {
            dailyData[day] = {
              min: minTemp,
              max: maxTemp,
              symbol: weatherSymbol,
            };
          } else {
            dailyData[day].min = Math.min(dailyData[day].min, minTemp);
            dailyData[day].max = Math.max(dailyData[day].max, maxTemp);
          }

          const item: Item = {
            dateStart,
            dateEnd,
            precipitation,
            humidity,
            clouds,
          };

          dataToItems.push(item);
        }

        // Convert daily data to an array
        const dailyWeatherArray = Object.entries(dailyData).map(
          ([day, { min, max, symbol }]) => ({
            day,
            minTemp: min - 273.15, // Convert to Celsius
            maxTemp: max - 273.15, // Convert to Celsius
            weatherSymbol: symbol,
          })
        );

        setDailyWeather(dailyWeatherArray);

        setChartData({
          xLabels: xLabels.slice(0, 8),
          precipitation: precipitationData.slice(0, 8),
          temperature: temperatureData.slice(0, 8),
          humidity: humidityData.slice(0, 8),
        });

        const limitedDataToItems = dataToItems.slice(0, 8); // Limit to 6 items
        setItems(limitedDataToItems);

        // Update `dataToItems` and `setItems` as before...
      }
    };

    fetchWeatherData();
  }, [currentCity, owm]);

  {
    /*
    const renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather
          title={indicator["title"]}
          subtitle={indicator["subtitle"]}
          value={indicator["value"]}
        />
      </Grid>
    ));
  };
  */
  }

  // Render daily cards
  const renderDailyCards = () =>
    dailyWeather.map((data, idx) => (
      <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
        <DayCard
          day={data.day}
          minTemp={data.minTemp}
          maxTemp={data.maxTemp}
          weatherSymbol={data.weatherSymbol}
        />
      </Grid>
    ));

  const getSeriesForVariable = () => {
    switch (selectedVariable) {
      case "precipitation":
        return [{ data: chartData.precipitation, label: "precipitation" }];
      case "temperature":
        return [{ data: chartData.temperature, label: "temperature" }];
      case "humidity":
        return [{ data: chartData.humidity, label: "humidity" }];
      default:
        return [{ data: [], label: "" }];
    }
  };

  const series = getSeriesForVariable();

  return (
    <Grid container spacing={5} padding={2}>
      <Grid size={{ xs: 12, xl: 12 }}>
        <SearchBar setCity={setCurrentCity} />
      </Grid>
      <Grid size={{ xs: 12, xl: 12 }}>
        <h1>Welcome to {currentCity || "Your City"}!</h1>
      </Grid>

      <Grid size={{ xs: 12, xl: 9 }}>
        <WeatherDashboard
          indicators={indicators}
          chartData={chartData}
          series={series}
          currentCity={currentCity}
          setSelectedVariable={setSelectedVariable}
          renderDailyCards={renderDailyCards}
        ></WeatherDashboard>
      </Grid>

      {/* Chart */}
      <Grid size={{ xs: 12, xl: 9 }}>
        <TableWeather itemsIn={items} />
      </Grid>
    </Grid>
  );
}

export default App;
