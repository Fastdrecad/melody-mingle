import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';
import { getURL } from '@/libs/helpers';

export async function POST(request: Request) {
  try {
    const { price, quantity = 1, metadata = {} } = await request.json();

    if (!price || !price.id) {
      console.error('Price information is missing or incomplete');
      return new NextResponse(
        'Bad Request: Price information is missing or incomplete',
        { status: 400 }
      );
    }
    console.log(price);

    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Failed to retrieve user:', userError);
      return new NextResponse('Unauthorized: No user found', { status: 401 });
    }
    console.log('user', user);

    const customer = await createOrRetrieveCustomer({
      uuid: user.id || '',
      email: user.email || ''
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: price.id,
          quantity: quantity
        }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: metadata
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}`
    });

    return new NextResponse(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to create checkout session:', error);
    return new NextResponse(`Internal Server Error: ${error.message}`, {
      status: 500
    });
  }
}
