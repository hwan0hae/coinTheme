import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IChartProps {
  isDarkMode: boolean;
}
interface IChartIdProps {
  coinId: string;
}
interface IHistorical {
  close: number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

function Chart() {
  // const { coinId } = useParams();
  const { coinId } = useOutletContext<IChartIdProps>();
  const isDarkMode = useRecoilValue(isDarkAtom);

  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <>
          <ApexChart
            type="line"
            series={[
              {
                name: "Price",
                data: data?.map((price) => price.close) ?? [],
              },
            ]}
            options={{
              theme: {
                mode: isDarkMode ? "dark" : "light",
              },
              chart: {
                height: 300,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: "transparent",
              },
              grid: {
                show: false,
              },
              stroke: {
                curve: "smooth",
                width: 4,
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                axisBorder: { show: false },
                labels: { show: false },
                axisTicks: { show: false },
                type: "datetime",
                categories: data?.map((date) => date.time_close),
              },
              fill: {
                type: "gradient",
                gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
              },
              colors: ["#0fbcf9"],
              tooltip: {
                y: {
                  formatter: (value) => `$ ${value.toFixed(3)}`,
                },
              },
            }}
          />
          <ApexChart
            type="candlestick"
            series={
              [
                {
                  data: data?.map((price) => ({
                    x: price.time_close,
                    y: [price.open, price.high, price.low, price.close],
                  })),
                },
              ] as any
            }
            options={{
              theme: {
                mode: isDarkMode ? "dark" : "light",
              },
              chart: {
                width: 500,
                height: 300,
                toolbar: { show: false },
                background: "transparent",
              },
              grid: { show: false },
              yaxis: {
                show: false,
              },
              xaxis: {
                axisTicks: { show: false },
                labels: { show: false },
                axisBorder: { show: false },
                type: "datetime",
              },
            }}
          />
        </>
      )}
    </div>
  );
}

export default Chart;
