import React from "react";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useDisconnect,
  useNFT,
} from "@thirdweb-dev/react";
import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import styles from "../styles/Home.module.css";

interface CheckoutProps {
  email: string;
  contract: any;
  clientSecret: string;
}

const Checkout: React.FC<CheckoutProps> = ({
  email,
  contract,
  clientSecret,
}) => {
  const { data: nft, error } = useNFT(contract, 2);
  const stripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
  const appearance: Appearance = {
    theme: "stripe",
    labels: "above",
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <p>You are signed in as: {email}</p>
      <div className={styles.nftCard}>
        {nft?.metadata && (
          <ThirdwebNftMedia
            metadata={nft?.metadata}
            style={{ width: 300, height: 300 }}
          />
        )}
        <p className={`${styles.centeredText}`}>
          Step into the world of the Rock Groupies, where electrifying riffs and
          soul-stirring melodies converge, creating a tight-knit community of
          passionate souls who live and breathe the essence of rock music. Being
          a Rock Groupie means immersing yourself in a culture that celebrates
          the timeless allure of guitars, powerful vocals, and the profound
          impact of rock in shaping generations. Join us on a musical journey
          that transcends boundaries, unleashing the sheer energy and emotion
          that only rock can deliver, uniting hearts and spirits in an
          unbreakable bond of rock 'n' roll camaraderie.
        </p>
        <p className={`${styles.limitText}`}>
          LIMITED TO ONE PURCHASE PER EMAIL ADDRESS
        </p>
        <p>Price: $150</p>
      </div>
      {clientSecret && <Elements options={options} stripe={stripe}></Elements>}
    </div>
  );
};

export default Checkout;
