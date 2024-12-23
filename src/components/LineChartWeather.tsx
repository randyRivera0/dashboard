import Paper from "@mui/material/Paper";
import { LineChart } from "@mui/x-charts/LineChart";

interface LineChartWeatherProps {
  xLabels: string[];
  series: { data: number[]; label: string }[];
}

export default function LineChartWeather({
  xLabels,
  series,
}: LineChartWeatherProps) {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LineChart
        width={400}
        height={250}
        series={series}
        xAxis={[{ scaleType: "point", data: xLabels }]}
      />
    </Paper>
  );
}
