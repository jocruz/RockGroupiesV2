import { useEffect, useState } from "react";

import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useDisconnect,
  useNFT,
} from "@thirdweb-dev/react";

import type { NextPage } from "next";
import { EDITION_ADDRESS } from "../constants/addresses";
import styles from "../styles/Home.module.css";
import { magicLink } from "@thirdweb-dev/react";
import { useConnect } from "@thirdweb-dev/react";
import axios from "axios";

import Checkout from "../components/Checkout";
import Signup from "../components/Signup";


const Home: NextPage = () => {
  const address = useAddress();
  const disconnect = useDisconnect();

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [customerId, setCustomerId] = useState<string>("");
  const { contract } = useContract(EDITION_ADDRESS, "signature-drop");
  const { data: nft, error } = useNFT(contract, 2);
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const connect = useConnect();

  const magicLinkConfig = magicLink({
    apiKey: process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY as string,
  });

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

  useEffect(() => {
    disconnect();
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (address && customerId) {
      // Call /api/stripe_intent
      const paymentIntent = async () => {
        try {
          const response = await axios.post("/api/stripe_intent", {
            address,
            customerId,
          });

          setClientSecret(response.data.client_secret);
        } catch (err) {
          console.log(err);
        }
      };
      paymentIntent();

      // Call /api/update_customer

      const updateCustomer = async () => {
        try {
          const response = await axios.post("/api/stripe_intent", {
            body: address,
            customerId,
          });
          setClientSecret(response.data.client_secret);
        } catch (err) {
          console.log(err);
        }
      };
      updateCustomer();
    }
  }, [address, customerId]);

  const handleLogin = async () => {
    if (firstName && lastName && phoneNumber && email) {
      try {
        const response = await axios.post("/api/create_customer", {
          firstName,
          lastName,
          phoneNumber,
          email,
        });

        const data = response.data;
        if (data.alreadyPurchased) {
          setMessage(
            "This email has already been used for a successful purchase."
          );
        } else if (data.customerId) {
          setCustomerId(data.customerId);
          await connect(magicLinkConfig, { email: email });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      {message && <h2>{message}</h2>}
      {address ? (
        <Checkout
          email={email}
          contract={contract}
          clientSecret={clientSecret}
        />
      ) : (
        <>
          <Signup
            setEmail={setEmail}
            setFirstName={setFirstName}
            setPhoneNumber={setPhoneNumber}
            setLastName={setLastName}
            handleLogin={handleLogin}
          />
        </>
      )}
    </div>
  );
};

export default Home;
