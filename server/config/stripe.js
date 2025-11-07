import stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    "ERROR: STRIPE_SECRET_KEY is not configured in environment variables"
  );
  throw new Error("Stripe secret key is missing");
}

const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

console.log("Stripe configured successfully");

export default Stripe;
