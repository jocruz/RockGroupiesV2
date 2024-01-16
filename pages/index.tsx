import { useEffect, useState } from "react";

import { useAddress, useContract, useDisconnect } from "@thirdweb-dev/react";

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

  //These states are passed onto the SignUp Component;
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [customerId, setCustomerId] = useState<string>("");

  //These states are passed onto the Checkout Component
  const { contract } = useContract(EDITION_ADDRESS, "signature-drop");
  const [clientSecret, setClientSecret] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const connect = useConnect();

  const magicLinkConfig = magicLink({
    apiKey: process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY as string,
  });

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

          console.log(
            "Hello this is: paymentinent: ",
            response.data.client_secret
          );
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
            address,
            customerId,
          });
          console.log(
            "Hello this is: updateCustomer: ",
            response.data.client_secret
          );
          setClientSecret(response.data.client_secret);
        } catch (err) {
          console.log(err);
        }
      };
      updateCustomer();
    }
  }, [address, customerId]);

  const handleLogin = async () => {
    console.log("I have been clicked");
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
