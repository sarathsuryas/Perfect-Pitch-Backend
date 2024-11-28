import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { PaymentSuccessDto } from 'src/user/dtos/paymentSuccess.dto';
import { MemberShipRepository } from 'src/user/repositories/membership.repository';
import Stripe from 'stripe';

@Injectable()
export class MembershipService {
  private stripe: Stripe;

  constructor(private _memberShipRepository:MemberShipRepository) {}
  async getMemberShip() {
    try {
      return await this._memberShipRepository.getMemberShip()
    } catch (error) {
      console.error(error)
    }
  }

  async checkActiveMemberShip(userId: string) {
    try {
      return await this._memberShipRepository.checkActiveMemberShip(userId)
    } catch (error) {
      console.error(error)
    }
  }
  
 
  async createSession(params,userId) {
    const stripe = new Stripe(configuration().stripe_secret_key);
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{price:params,quantity:1}],
      mode:'payment',
      success_url:configuration().success_url,
      cancel_url:configuration().cancel_url,
    })
    return session.id
  }
 
  async paymentSuccess(data:PaymentSuccessDto) {
    try {
      await this._memberShipRepository.paymentSuccess(data)
    } catch (error) {
      console.error(error)
    }
  }


}
