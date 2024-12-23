import { useState, useRef } from "react";
import IndicatorsButtonGroupExample from "./IndicatorsButtonGroup";

interface ControlWeatherProps {
  setSelectedVariable: (variable: string) => void;
}

export default function ControlWeather({
  setSelectedVariable,
}: ControlWeatherProps) {
  {
    /* Constante de referencia a un elemento HTML */
  }
  const descriptionRef = useRef<HTMLDivElement>(null);
  {
    /* Variable de estado y función de actualización */
  }
  let [, setSelected] = useState(-1);
  {
    /* Arreglo de objetos */
  }
  let items = [
    {
      name: "precipitation",
      description:
        "Cantidad de agua que cae sobre una superficie en un período específico.",
    },
    {
      name: "humidity",
      description:
        "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje.",
    },
    {
      name: "temperature",
      description:
        "Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida.",
    },
  ];

  {
    /* 
    let options = items.map((item, key) => (
    <MenuItem key={key} value={key}>
      {item["name"]}
    </MenuItem>
  ));
    */
  }

  const handleChange = (selectedOption: string) => {
    const selectedItem = items.find((item) => item.name === selectedOption);
    if (selectedItem) {
      setSelectedVariable(selectedItem.name); // Pass the selected variable to parent
      setSelected(items.indexOf(selectedItem)); // Update the selected state
      if (descriptionRef.current) {
        descriptionRef.current.innerHTML = selectedItem.description; // Show description
      }
    }
  };

  {
    /* 
  const handleChange = (event: SelectChangeEvent) => {
    let idx = parseInt(event.target.value);
    // alert( idx );
    setSelected(idx);
    const selectedItem = items[idx];
    setSelectedVariable(selectedItem.name);

    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = selectedItem.name;
    }

    {
      /* Modificación de la referencia descriptionRef 

    if (descriptionRef.current !== null) {
      descriptionRef.current.innerHTML =
        idx >= 0 ? items[idx]["description"] : "";
    }
        
    }
  };*/
  }
  return (
    <IndicatorsButtonGroupExample
      options={items.map((item) => item.name)}
      onChange={handleChange}
    />
  );
}
