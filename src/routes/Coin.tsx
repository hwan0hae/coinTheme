import { useQuery } from "react-query";
import { Helmet } from "react-helmet-async";
import {
  Outlet,
  useLocation,
  useParams,
  Link,
  useMatch,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto; //크기에맞춰 가운데
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 40px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0px;
`;
const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;

  a {
    display: block;
    padding: 7px 0px;
    transition: color 0.5s ease-in-out;

    color: ${(props) => (props.isActive ? props.theme.accentColor : "white")};

    &:hover {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Back = styled.div`
  position: fixed;
  top: 100px;
  left: 30px;
  border-radius: 50px;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);

  a {
    color: white;
    text-align: center;
    padding-top: 4px;
    font-size: 40px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    transition: 0.2s color ease-in-out, 0.2s border-color ease-in-out;
    border: 0.5px solid ${(props) => props.theme.textColor};
  }
  a:hover {
    color: ${(props) => props.theme.accentColor};
    border-color: ${(props) => props.theme.accentColor};
  }
`;

const Toggle = styled.button`
  position: fixed;
  top: 30px;
  left: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 30px;
  border: 0.5px solid ${(props) => props.theme.textColor};
  transition: 0.2s border-color ease-in-out;
  &:hover {
    border-color: ${(props) => props.theme.accentColor};
  }
`;

// const CoinInfo = styled.div``;

// interface CoinTabProps {
//   bgColor?: string;
// }

// const CoinTab = styled.div<CoinTabProps>`
//   border-radius: 10px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   flex-wrap: wrap;
//   margin: 20px 0px;
//   font-size: 18px;
//   background-color: ${(props) => props.bgColor};
// `;
// const CoinItem = styled.div`
//   margin: 15px 20px;
// `;

// const CoinItemName = styled.span`
//   display: block;
//   text-align: center;
//   font-size: 14px;
// `;
// const CoinItemResult = styled.span`
//   display: block;
//   text-align: center;
//   font-size: 22px;
//   margin-top: 10px;
// `;

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
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

function Coin() {
  // const [info, setInfo] = useState<infoData>();
  // const [loading, setLoading] = useState(true);
  // const [priceInfo, setPriceInfo] = useState<PriceData>();
  // const getCoinData = async () => {
  //   const infoData = await axios(
  //     `https://api.coinpaprika.com/v1/coins/${coinId}`
  //   );
  //   const priceData = await axios(
  //     `https://api.coinpaprika.com/v1/tickers/${coinId}`
  //   );
  //   setInfo(infoData.data);
  //   setPriceInfo(priceData.data);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   getCoinData();
  // }, [coinId]);
  const { coinId } = useParams();
  const { state } = useLocation();
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(`${coinId}`)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(`${coinId}`),
    {
      refetchInterval: 5000,
    }
  );
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>{`${state ?? (loading ? "Loading..." : infoData?.name)}`}</title>
      </Helmet>
      <Toggle onClick={toggleDarkAtom}>&#127769;</Toggle>
      <Back>
        <Link to="../">&larr;</Link>
      </Back>

      <Header>
        <Title>{state ?? (loading ? "Loading..." : infoData?.name)}</Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to="./price">price</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to="./chart">chart</Link>
            </Tab>
          </Tabs>

          <Outlet context={{ coinId }} />
        </>
        // <CoinInfo>
        //   <CoinTab bgColor="#111111">
        //     <CoinItem>
        //       <CoinItemName>Rank: </CoinItemName>
        //       <CoinItemResult>{info?.rank}</CoinItemResult>
        //     </CoinItem>
        //     <CoinItem>
        //       <CoinItemName>SYMBOL: </CoinItemName>
        //       <CoinItemResult>${info?.symbol}</CoinItemResult>
        //     </CoinItem>
        //     <CoinItem>
        //       <CoinItemName>OPEN SOURCE: </CoinItemName>
        //       <CoinItemResult>
        //         {info?.open_source ? "Yes" : "No"}
        //       </CoinItemResult>
        //     </CoinItem>
        //   </CoinTab>
        //   <CoinTab>{info?.description}</CoinTab>
        //   <CoinTab bgColor="#111111">
        //     <CoinItem>
        //       <CoinItemName>TOTAL SUPLY: </CoinItemName>
        //       <CoinItemResult>{priceInfo?.total_supply}</CoinItemResult>
        //     </CoinItem>
        //     <CoinItem>
        //       <CoinItemName>MAX SUPPLY: </CoinItemName>
        //       <CoinItemResult>{priceInfo?.max_supply}</CoinItemResult>
        //     </CoinItem>
        //   </CoinTab>
        //   <Outlet />
        // </CoinInfo>
      )}
    </Container>
  );
}

export default Coin;
