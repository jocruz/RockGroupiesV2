import React, { useState } from "react";
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
import { Text } from "@chakra-ui/react";
import Form from "./Form";


interface CheckoutProps {
  email: string;
  contract: any;
  clientSecret: any;
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

  console.log(clientSecret);

  return (
    <section>
      <Text
        fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
        letterSpacing="wider"
        color="green.800"
        textAlign="center"
        my={4}
        px={4}
      >
        You are signed in as: {email}
      </Text>
      <div className={styles.nftCard}>
        {nft?.metadata && (
          <ThirdwebNftMedia
            metadata={nft?.metadata}
            style={{ width: 300, height: 300 }}
          />
        )}
        <Text
          fontSize={["sm", "md", "lg"]}
          textAlign="center"
          my={[3, 4]}
          px={[3, 4]}
          lineHeight="tall"
          fontWeight="semibold"
          color="gray.800"
          letterSpacing="wider"
          w={["90%", "80%", "70%"]}
          mx="auto"
        >
          Step into the world of the Rock Groupies, where electrifying riffs and
          soul-stirring melodies converge, creating a tight-knit community of
          passionate souls who live and breathe the essence of rock music. Being
          a Rock Groupie means immersing yourself in a culture that celebrates
          the timeless allure of guitars, powerful vocals, and the profound
          impact of rock in shaping generations. Join us on a musical journey
          that transcends boundaries, unleashing the sheer energy and emotion
          that only rock can deliver, uniting hearts and spirits in an
          unbreakable bond of rock 'n' roll camaraderie.
        </Text>

        <Text fontSize="md" color="red.600" textAlign="center" my={2}>
          LIMITED TO ONE PURCHASE PER EMAIL ADDRESS
        </Text>
        <p>Price: $150</p>

        {clientSecret && (
          <Elements options={options} stripe={stripe}>
            <Form />
          </Elements>
        )}
      </div>
    </section>
  );
};

export default Checkout;
