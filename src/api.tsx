import axios from "axios";

const BASE_URL = `https://api.coinpaprika.com/v1`;

export async function fetchCoins() {
  const coinsData = await axios(`${BASE_URL}/coins`);
  return coinsData.data;
}

export async function fetchCoinInfo(coinId: string) {
  const infoData = await axios(`${BASE_URL}/coins/${coinId}`);
  return infoData.data;
}
export async function fetchCoinTickers(coinId: string) {
  const tickersData = await axios(`${BASE_URL}/tickers/${coinId}`);
  return tickersData.data;
}

export async function fetchCoinHistory(coinId: string) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 7;
  const historyData = await axios(
    `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}&start=${startDate}&end=${endDate}`
  );
  return historyData.data;
}
