// api/create-checkout-session.js

import { stripe } from '@/services/stripe/client';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@clerk/backend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  let userIdFromToken = null;

  try {
    const clerkPayload = await verifyToken(token);
    userIdFromToken = clerkPayload.sub;
  } catch (err) {
    console.warn('Invalid or missing Clerk token:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { planId, email, countryCode } = req.body;
  const userId = req.body.userId || userIdFromToken;

  if (!planId || !email || !countryCode || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate and resolve regional price ID
  const MATCH_KEY = `${countryCode.toUpperCase()}_${planId.toUpperCase()}`;
  const PRICE_ID = process.env[`PRICE_${MATCH_KEY}`];

  if (!PRICE_ID) {
    return res.status(404).json({ error: `No price ID for ${MATCH_KEY}` });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
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
    return res.status(500).json({ error: 'Could not create checkout session' });
  }
}

