import Grid from "@mui/material/Grid2";
import IndicatorWeather from "./components/IndicatorWeather";
import TableWeather from "./components/TableWeather";
import ControlWeather from "./components/ControlWeather";
import LineChartWeather from "./components/LineChartWeather";
import Indicator from "./interfaces/Indicator";
import { useEffect, useState } from "react";
import Item from "./interfaces/Item";
import "./App.css";
import { ownerDocument } from "@mui/material";

// Define the interface for props
interface AppProps {
  city: string;
}

// SearchBar Component to handle city input
interface SearchBarProps {
  setCity: React.Dispatch<React.SetStateAction<string>>; // This function will update the city state
}

const SearchBar: React.FC<SearchBarProps> = ({ setCity }) => {
  const [cityInput, setCityInput] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(event.target.value); // Update local input state
  };

  const handleButtonClick = () => {
    setCity(cityInput); // Update the city state in the parent component
    console.log("City changed to:", cityInput); // Log the city to console
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city"
        value={cityInput} // Bind the input value to the state
        onChange={handleInputChange} // Handle input change
      />
      <button onClick={handleButtonClick}>Submit</button>{" "}
      {/* Button to submit the city */}
    </div>
  );
};

function App({ city }: AppProps) {
  const [currentCity, setCurrentCity] = useState<string>(city || ""); // Set initial city if passed
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"));
  const [items, setItems] = useState<Item[]>([]);

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
        let name = xml.getElementsByTagName("name")[0].innerHTML || "";
        dataToIndicators.push({
          title: "Location",
          subtitle: "City",
          value: name,
        });

        let location = xml.getElementsByTagName("location")[1];

        let latitude = location.getAttribute("latitude") || "";
        dataToIndicators.push({
          title: "Location",
          subtitle: "Latitude",
          value: latitude,
        });

        let longitude = location.getAttribute("longitude") || "";
        dataToIndicators.push({
          title: "Location",
          subtitle: "Longitude",
          value: longitude,
        });

        let altitude = location.getAttribute("altitude") || "";
        dataToIndicators.push({
          title: "Location",
          subtitle: "Altitude",
          value: altitude,
        });

        setIndicators(dataToIndicators);

        let dataToItems: Item[] = [];
        const timeNodes = xml.getElementsByTagName("time");

        for (let i = 0; i < timeNodes.length; i++) {
          const timeNode = timeNodes[i];
          const dateStart = timeNode.getAttribute("from") || "";
          const dateEnd = timeNode.getAttribute("to") || "";

          const precipitationNode =
            timeNode.getElementsByTagName("precipitation")[0];
          const precipitation =
            precipitationNode?.getAttribute("probability") || "";

          const humidityNode = timeNode.getElementsByTagName("humidity")[0];
          const humidity = humidityNode?.getAttribute("value") || "";

          const cloudsNode = timeNode.getElementsByTagName("clouds")[0];
          const clouds = cloudsNode?.getAttribute("all") || "";

          const item: Item = {
            dateStart,
            dateEnd,
            precipitation,
            humidity,
            clouds,
          };

          dataToItems.push(item);
        }

        const limitedDataToItems = dataToItems.slice(0, 6); // Limit to 6 items
        setItems(limitedDataToItems);
      }
    };

    fetchWeatherData();
  }, [currentCity, owm]); // Dependency array now listens for changes to `currentCity`

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

  return (
    <Grid container spacing={5}>
      <h1>Welcome to {currentCity || "Your City"}!</h1>
      {/* Pass the setCity function to the SearchBar component */}
      <SearchBar setCity={setCurrentCity} />

      {renderIndicators()}

      {/* Table */}
      <Grid size={{ xs: 12, xl: 8 }}>
        {/* Grid Nested */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather />
          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
            <TableWeather itemsIn={items} />
          </Grid>
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather />
      </Grid>
    </Grid>
  );
}

export default App;
