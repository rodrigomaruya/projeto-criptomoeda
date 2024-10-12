import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { coinProps } from "../home/home";
import { api } from "../../api/api";
import styles from "./details.module.css";
interface resultProps {
  data: {
    data: coinProps;
  };
}

export function Details() {
  const { search } = useParams();
  const [detailCoin, setDetailCoin] = useState<coinProps>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const price = Intl.NumberFormat("en-Us", {
    style: "currency",
    currency: "USD",
  });
  const priceCompact = Intl.NumberFormat("en-Us", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  });

  useEffect(() => {
    async function coinDetail() {
      try {
        const { data }: resultProps = await api.get(
          `https://api.coincap.io/v2/assets/${search}`
        );
        const dataResult = data.data;

        const formatResult = {
          ...dataResult,
          formatPrice: price.format(Number(dataResult.priceUsd)),
          formatMarket: priceCompact.format(Number(dataResult.marketCapUsd)),
          formatVolume: priceCompact.format(Number(dataResult.volumeUsd24Hr)),
        };
        setDetailCoin(formatResult);
        setLoading(false);
      } catch (error) {
        console.log(error);

        navigate("*");
      }
    }
    coinDetail();
  }, [search, navigate, price, priceCompact]);

  if (loading || !detailCoin) {
    return <h1 className={styles.center}>Carregando...</h1>;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{detailCoin?.name} </h1>
      <h1 className={styles.center}>{detailCoin?.symbol} </h1>
      <div className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${detailCoin.symbol.toLowerCase()}@2x.png`}
          alt="logo da moeda"
        />
        <p>
          <strong>Preço:</strong> {detailCoin?.formatPrice}
        </p>
        <p>
          <strong>Mercado:</strong> {detailCoin?.formatMarket}
        </p>
        <p>
          <strong>Volume:</strong> {detailCoin?.formatVolume}
        </p>
        <p>
          <strong>Mudança 24h:</strong>{" "}
          <span
            className={
              Number(detailCoin?.changePercent24Hr) > 0
                ? styles.profit
                : styles.loss
            }
          >
            {Number(detailCoin?.changePercent24Hr).toFixed(3)}
          </span>
        </p>
      </div>
    </div>
  );
}
