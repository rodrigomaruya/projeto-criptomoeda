import { FormEvent, useCallback, useEffect, useState } from "react";
import { api } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import { FaSearch } from "react-icons/fa";

//https://api.coincap.io/v2/assets?limit=10&offset=0

export interface coinProps {
  id: string;
  symbol: string;
  volumeUsd24Hr: string;
  name: string;
  marketCapUsd: string;
  maxSupply: string;
  explorer: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  vwap24Hr: string;
  priceUsd: string;
  formatVolume?: string;
  formatMarket?: string;
  formatPrice?: string;
}
interface dataProps {
  data: {
    data: coinProps[];
  };
}

export function Home() {
  const [input, setInput] = useState("");
  const [coin, setCoin] = useState<coinProps[]>([]);
  const [offset, setOffSet] = useState(0);

  const navigate = useNavigate();

  const getCoins = useCallback(async () => {
    const price = Intl.NumberFormat("en-Us", {
      style: "currency",
      currency: "USD",
    });
    const priceCompact = Intl.NumberFormat("en-Us", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    });

    try {
      const { data }: dataProps = await api.get(
        `/v2/assets?limit=10&offset=${offset}`
      );
      const dataCoins = data.data;
      const formatResult = dataCoins.map((item) => {
        const format = {
          ...item,
          formatPrice: price.format(Number(item.priceUsd)),
          formatMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
        };
        return format;
      });
      setCoin((prevCoin) => [...prevCoin, ...formatResult]);
    } catch (error) {
      console.log(error);
    }
  }, [offset]);

  useEffect(() => {
    getCoins();
  }, [getCoins]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input) return;
    navigate(`/details/${input.toLowerCase()}`);
  }
  function handleGetMore() {
    if (offset === 0) {
      setOffSet(10);
      return;
    }

    setOffSet(offset + 10);
    console.log(offset);
  }
  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite uma nome da moeda... Ex bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <FaSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coin.length > 0 &&
            coin.map((item, index) => (
              <tr className={styles.tr} key={index}>
                <td className={styles.tdLabel1} data-label="moeda">
                  <div className={styles.name}>
                    <img
                      className={styles.imgLogo}
                      src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                      alt="cripto logo"
                    />
                    <Link to={`/details/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>

                <td className={styles.tdLabel1} data-label="valor mercado">
                  {item.formatMarket}
                </td>

                <td className={styles.tdLabel1} data-label="Preço">
                  {item.formatPrice}
                </td>

                <td className={styles.tdLabel1} data-label="Volume">
                  {item.formatVolume}
                </td>

                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLoss
                  }
                  data-label="Mudança 24h"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button onClick={handleGetMore} className={styles.getMore}>
        Carregar mais...
      </button>
    </main>
  );
}
