import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState } from "react";
import { Text, Button, Box, VStack } from "@chakra-ui/react";

const Form = () => {
  const elements = useElements();
  const stripe = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<null | string | undefined>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(true);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setIsSuccess(true);
          setMessage("Your payment was successful!");
          setShowPaymentForm(false);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          setShowPaymentForm(false);
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const URL = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return <h2>Something went wrong..</h2>;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: URL,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
      setShowPaymentForm(false); // hide the form
      console.log(error.message);
    } else {
      setMessage("An unexpected error occurred.");
      setShowPaymentForm(false); // hide the form
      console.log(error.message);
    }

    setIsLoading(false);
  };

  return (
    <div>
      {showPaymentForm ? (
        <form className={styles.PaymentForm} onSubmit={handleSubmit}>
          <PaymentElement
            options={{
              paymentMethodOrder: ["card"],
              layout: { type: "tabs" },
            }}
          />
          <button
            className={`${styles.mainButton} ${styles.payButton}`}
            disabled={isLoading || !stripe || !elements}
          >
            <span>{isLoading ? "Loading..." : "Pay now"}</span>
          </button>
        </form>
      ) : (
        <button
          className={`${styles.mainButton} ${styles.payButton}`}
          onClick={() => setShowPaymentForm(true)}
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default Form;
