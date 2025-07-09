import { stripe } from '@/lib/stripe';

export default async function handler(req, res) {
  const { planId, userId, email, countryCode } = req.body;

  if (!planId || !email || !countryCode || !userId) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  // Resolve region-based price ID
  const MATCH_KEY = `${countryCode.toUpperCase()}_${planId.toUpperCase()}`; // e.g. US_STARTER
  const PRICE_ID = process.env[`PRICE_${MATCH_KEY}`]; // set these in env vars

  if (!PRICE_ID) {
    return res.status(404).json({ error: 'Price ID not found for region' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1
        }
      ],
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId,
          country: countryCode
        }
      },
      success_url: `${process.env.BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/pricing`
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[Stripe Checkout Error]', err.message);
    return res.status(500).json({ error: 'Could not start checkout' });
  }
}
      
