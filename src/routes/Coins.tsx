import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
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

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  border: 0.5px solid white;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 10px;
  border-radius: 15px;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  } // li 올릴시 앵커에 색을 변경해라 앵커의 색이 변할시 0.2초 걸리게해라
`;

const Title = styled.h1`
  font-size: 40px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
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

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  // const [coins, setCoins] = useState<CoinInterface[]>([]);
  // const [loading, setLoading] = useState(true);
  // const getCoins = async () => {
  //   const json = await axios("https://api.coinpaprika.com/v1/coins");
  //   setCoins(json.data.slice(0, 100));
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   getCoins();
  // }, []);

  return (
    <Container>
      <Helmet>
        <title>Coin</title>
      </Helmet>
      <Toggle onClick={toggleDarkAtom}>&#127769;</Toggle>
      <Header>
        <Title>Coin</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              {" "}
              <Link to={`/${coin.id}`} state={coin.name}>
                <Img
                  src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                />
                {coin.name} &rarr;{" "}
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
