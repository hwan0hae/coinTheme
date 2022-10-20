import styled from "styled-components";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";

import { fetchCoinTickers } from "../api";

const Overview = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  gap: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  color: white;
  span:first-child {
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    margin-top: 5px;
    color: ${(props) => props.theme.accentColor};
  }
  span:nth-child(2) {
    font-size: 12px;
  }

  span:nth-child(3) {
    font-size: 25px;
    font-weight: 400;
    margin: 5px;
  }
`;
interface IPriceProps {
  coinId: string;
}
interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Price() {
  const { coinId } = useOutletContext<IPriceProps>();
  const { isLoading, data } = useQuery<IPriceData>(["price", coinId], () =>
    fetchCoinTickers(coinId)
  );

  return (
    <>
      {isLoading ? (
        "Price Loading..."
      ) : (
        <Overview>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(1y)</span>
            <span>{data?.quotes.USD.percent_change_1y}</span>
          </OverviewItem>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(30d)</span>
            <span>{data?.quotes.USD.percent_change_30d}</span>
          </OverviewItem>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(7d)</span>
            <span>{data?.quotes.USD.percent_change_7d}</span>
          </OverviewItem>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(24h)</span>
            <span>{data?.quotes.USD.percent_change_24h}</span>
          </OverviewItem>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(6h)</span>
            <span>{data?.quotes.USD.percent_change_6h}</span>
          </OverviewItem>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(1h)</span>
            <span>{data?.quotes.USD.percent_change_1h}</span>
          </OverviewItem>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(30m)</span>
            <span>{data?.quotes.USD.percent_change_30m}</span>
          </OverviewItem>
          <OverviewItem>
            <span>Percent Change</span>
            <span>(15m)</span>
            <span>{data?.quotes.USD.percent_change_15m}</span>
          </OverviewItem>
        </Overview>
      )}
    </>
  );
}

export default Price;
