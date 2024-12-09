import Grid from '@mui/material/Grid2' 
import IndicatorWeather from './components/IndicatorWeather'
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Indicator  from './interfaces/Indicator';
{/* Hooks */ }
import { useEffect, useState } from 'react';
import Item from './interfaces/Item';
import './App.css'



function App() {
  
    {/* Variable de estado y función de actualización */ }
    let [indicators, setIndicators] = useState<Indicator[]>([])
    let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
    
    const [items, setItems] = useState<Item[]>([]);
  
    {/* Hook: useEffect */ }
    useEffect(() => {
  
      let request = async () => {
  
        {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
        let savedTextXML = localStorage.getItem("openWeatherMap") || "";
        let expiringTime = localStorage.getItem("expiringTime");
  
        {/* Obtenga la estampa de tiempo actual */ }
        let nowTime = (new Date()).getTime();
  
        {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */ }
        if (expiringTime === null || nowTime > parseInt(expiringTime)) {
  
          {/* Request */ }
          let API_KEY = "5c39343e5c27e119e010125e99fa753a"
          let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
          savedTextXML = await response.text();
  
          {/* Tiempo de expiración */ }
          let hours = 0.01
          let delay = hours * 3600000
          let expiringTime = nowTime + delay
  
          {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
          localStorage.setItem("openWeatherMap", savedTextXML)
          localStorage.setItem("expiringTime", expiringTime.toString())
          localStorage.setItem("nowTime", nowTime.toString())
  
          {/* DateTime */ }
          localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
          localStorage.setItem("nowDateTime", new Date(nowTime).toString())
  
          {/* Modificación de la variable de estado mediante la función de actualización */ }
          setOWM(savedTextXML)
        }
  
        {/* Valide el procesamiento con el valor de savedTextXML */}
        if( savedTextXML ) {
  
          {/* XML Parser */ }
          const parser = new DOMParser();
          const xml = parser.parseFromString(savedTextXML, "application/xml");
          
          {/* Arreglo para agregar los resultados */ }
  
          let dataToIndicators: Indicator[] = new Array<Indicator>();
  
          {/* 
              Análisis, extracción y almacenamiento del contenido del XML 
              en el arreglo dataToIndicators
          */}
  
          let name = xml.getElementsByTagName("name")[0].innerHTML || ""
          dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })
  
          let location = xml.getElementsByTagName("location")[1]
  
          let latitude = location.getAttribute("latitude") || ""
          dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })
  
          let longitude = location.getAttribute("longitude") || ""
          dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })
  
          let altitude = location.getAttribute("altitude") || ""
          dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })
  
          {/* Modificación de la variable de estado*/ }
          setIndicators(dataToIndicators)
  
          let dataToItems: Item[] = [];
          const timeNodes = xml.getElementsByTagName("time");
  
          for (let i = 0; i < timeNodes.length; i++) {
            const timeNode = timeNodes[i];
            const dateStart = timeNode.getAttribute("from") || "";
            const dateEnd = timeNode.getAttribute("to") || "";
  
            const precipitationNode = timeNode.getElementsByTagName("precipitation")[0];
            const precipitation = precipitationNode?.getAttribute("probability") || "";
  
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
  
          const limitedDataToItems = dataToItems.slice(0, 6); // 6 elementos
          setItems(limitedDataToItems);
        }
    };
      
    request();
  
    }, [owm])
  
    let renderIndicators = () => {
  
      return indicators
        .map(
          (indicator, idx) => (
            <Grid key={idx} size={{ xs: 12, xl: 3 }}>
              <IndicatorWeather
                title={indicator["title"]}
                subtitle={indicator["subtitle"]}
                value={indicator["value"]} />
            </Grid>
          )
        )
  
    }
  
    return (
      <Grid container spacing={5}>
        
        {renderIndicators()}
  
        {/* Tabla */}
        <Grid size={{ xs: 12, xl: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, xl: 3 }}>
              <ControlWeather />
            </Grid>
            <Grid size={{ xs: 12, xl: 9 }}>
              <TableWeather itemsIn={ items } />
            </Grid>
          </Grid>
        </Grid>
  
  
        {/* Gráfico */}
        <Grid size={{ xs: 12, xl: 4 }}>
          <LineChartWeather />
        </Grid>
  
      </Grid>
    )
  }
  
  export default App