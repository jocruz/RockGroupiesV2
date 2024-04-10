# 🎨 NFT Marketplace with Stripe Integration

## Overview
This project showcases the integration of Stripe for processing payments in an NFT marketplace, enabling users to purchase NFTs through a streamlined checkout process.

## Key Features
- 🛒 **NFT Purchasing**: Allows users to buy NFTs using Stripe.
- 📦 **Stripe Integration**: Secure payment processing for NFT transactions.
- 🔐 **Customer Management**: Creates and updates customer details in Stripe.
- 🌐 **Thirdweb Integration**: Leverages Thirdweb for NFT minting and management.

## Technologies Used
- **Next.js**: For the front-end and API routes.
- **Stripe**: To handle payment processing.
- **Thirdweb SDK**: For NFT operations on the Polygon blockchain.
- **Chakra UI**: For styling the React components.

## Project Structure

### API Routes
- **`create_customer.ts`**: Creates a Stripe customer or fetches an existing one by email. Checks if the customer has already made a purchase.
- **`stripe_intent.ts`**: Creates a Stripe payment intent for the transaction, allowing users to proceed with the payment.
- **`update_customer.ts`**: Updates the customer's information in Stripe, primarily used for adding metadata like the user's address.
- **`webhook.ts`**: Handles Stripe webhook events to process payment confirmations and triggers NFT minting upon successful payment.

### Front-end Pages
- **`_app.tsx`**: Sets up the ThirdwebProvider and ChakraProvider for the Next.js app.
- **`index.tsx`**: The main page where users sign up, log in, and proceed to the NFT checkout process.

### Components
- **`Checkout.tsx`**: Manages the checkout flow, including displaying NFT information and handling the Stripe payment form.
- **`Form.tsx`**: Renders the Stripe PaymentElement for card information input and payment submission.
- **`Signup.tsx`**: A form for user registration, capturing details like name, email, and phone number before proceeding to payment.
- **`TermsAndConditions.tsx`**: Displays terms and conditions with an accept button to ensure user agreement before making a purchase.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install` or `yarn install`.
3. Set up your `.env` file with the necessary Stripe and Thirdweb credentials.
4. Run the development server using `npm run dev` or `yarn dev`.


## How It Works

1. **Initialization** (`_app.tsx`):
    - Sets up the application environment using `ThirdwebProvider` for blockchain interactions and `ChakraProvider` for UI styling.
    - Configures `magicLink` for authentication, supporting seamless login and wallet connection on the Polygon blockchain.

2. **User Interaction** (`index.tsx`):
    - Users begin their journey on the home page, where they can sign up or log in via the `Signup` component.
    - Upon successful login, `create_customer.ts` is invoked to either fetch or create a new Stripe customer record, linking the user's session with their Stripe and blockchain identities.

3. **User Registration** (`Signup.tsx`):
    - Collects user information (name, email, phone) and creates a new Stripe customer if one doesn’t already exist, handled by `create_customer.ts`.
    - Checks for previous NFT purchases to prevent duplicate transactions.

4. **Payment Intent Creation** (`stripe_intent.ts` & `index.tsx`):
    - After registration, `stripe_intent.ts` generates a payment intent for the NFT purchase, securing the item for checkout.
    - The user’s Stripe customer ID is used to link the payment with their account.

5. **Checkout Process** (`Checkout.tsx` & `Form.tsx`):
    - The `Checkout` component displays the NFT details and leads the user to the Stripe payment form managed in `Form.tsx`.
    - Users complete the payment, and Stripe processes the transaction securely.

6. **Payment Confirmation and NFT Minting** (`webhook.ts`):
    - Stripe's webhook sends notifications of payment status to `webhook.ts`.
    - Upon successful payment, the Thirdweb SDK mints the NFT and transfers it to the user’s wallet, finalizing the purchase.

## 🚀 API Endpoints Overview

This section details the backend API endpoints used in the NFT Marketplace project to facilitate user registration, payment processing, and NFT transactions via Stripe and Thirdweb.

### 1. **Create Customer (`create_customer.ts`)**

- **Purpose**: Registers a new customer in Stripe or retrieves an existing one by email.
- **Method**: `POST`
- **Data Handling**:
  - Checks if the customer already exists in Stripe.
  - If not, creates a new customer record with provided details (name, email, phone).
  - Checks previous purchases to prevent duplicate transactions.

```typescript
// Endpoint: /api/create_customer
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
...
```

### 2. **Stripe Intent (`stripe_intent.ts`)**

- **Purpose**: Creates a payment intent in Stripe for processing NFT purchases.
- **Method**: `POST`
- **Features**:
  - Sets the transaction amount and currency.
  - Associates the payment with the customer’s ID.
  - Restricts payment method to card only.

```typescript
// Endpoint: /api/stripe_intent
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
...
```

### 3. **Update Customer (`update_customer.ts`)**

- **Purpose**: Updates existing customer information in Stripe, particularly the address.
- **Method**: `POST`
- **Functionality**:
  - Receives customer ID and new address data.
  - Updates the customer’s metadata in Stripe with the new address.

```typescript
// Endpoint: /api/update_customer
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
...
```

### 4. **Webhook (`webhook.ts`)**

- **Purpose**: Handles Stripe webhook events to finalize the NFT purchase process.
- **Method**: `POST`
- **Process**:
  - Validates the event using Stripe’s signature.
  - On successful payment, interacts with Thirdweb SDK to transfer the NFT to the customer’s address.

```typescript
// Endpoint: /api/webhook
import Stripe from 'stripe';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
...
```

## Implementation Highlights

- Utilizes Stripe’s robust API for customer and payment management.
- Integrates Thirdweb SDK for seamless NFT minting and transfers.
- Employs webhooks for real-time event handling and process completion.
