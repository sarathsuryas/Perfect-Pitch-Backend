import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  
  constructor() {
  }
  async createSession(params) {
    const stripe = new Stripe(configuration().stripe_secret_key);
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{price:params,quantity:1}],
      mode:'payment',
      success_url:configuration().success_url,
      cancel_url:configuration().cancel_url
    })
    return session.id
  }
 
    
}
