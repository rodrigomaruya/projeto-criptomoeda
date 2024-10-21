import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { coinProps } from "../home/home";
import styles from "./details.module.css";

interface resultProps {
  data: coinProps;
}
interface ErrorProps {
  error: string;
}
type dataProps = resultProps | ErrorProps;

export function Details() {
  const { search } = useParams();
  const [detailCoin, setDetailCoin] = useState<coinProps>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [erro, setError] = useState("");

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
      fetch(`https://api.coincap.io/v2/assets/${search}`)
        .then((res) => res.json())
        .then((data: dataProps) => {
          if ("error" in data) {
            setError(data.error);
            setLoading(false);
          } else {
            const dataResult = data.data; // Acessa os dados da moeda

            const formatResult = {
              ...dataResult,
              formatPrice: price.format(Number(dataResult?.priceUsd)),
              formatMarket: priceCompact?.format(
                Number(dataResult?.marketCapUsd)
              ),
              formatVolume: priceCompact?.format(
                Number(dataResult?.volumeUsd24Hr)
              ),
            };
            setDetailCoin(formatResult);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    coinDetail();
  }, [search, navigate, price, priceCompact, detailCoin]);

  if (loading) {
    return <h1 className={styles.center}>Carregando...</h1>;
  }
  if (erro) {
    return <div className={styles.center}>{erro}</div>;
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{detailCoin?.name} </h1>
      <h1 className={styles.center}>{detailCoin?.symbol} </h1>
      <div className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${detailCoin?.symbol.toLowerCase()}@2x.png`}
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
