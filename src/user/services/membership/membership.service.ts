import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { PaymentSuccessDto } from 'src/user/dtos/paymentSuccess.dto';
import { IMemberShip } from 'src/user/interfaces/IMemberShip';
import { MemberShipRepository } from 'src/user/repositories/membership.repository';
import Stripe from 'stripe';

@Injectable()
export class MembershipService {
  private stripe: Stripe;

  constructor(private _memberShipRepository:MemberShipRepository) {}
  async getMemberShip():Promise<IMemberShip[]> {
    try {
      return await this._memberShipRepository.membershipRepo.findByQuery<IMemberShip>({isBlocked:false})
    } catch (error) {
      console.error(error)
    }
  }

  async checkActiveMemberShip(userId: string):Promise<boolean> {
    try {
      const data =  await this._memberShipRepository.paymentRepo.findOneByQuery({userId:userId})
      if (data) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
    }
  }
  
 
  async createSession(params,userId):Promise<string> {
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
 
 
  async paymentSuccess(data:PaymentSuccessDto):Promise<void> {
    try {
      await this._memberShipRepository.paymentRepo.create({
        paymentId: data.id,
        amount: data.amount_subtotal / 100,
        userId: data.customer_details.userId,
        email: data.customer_details.email,
        name: data.customer_details.name,
        valid: true,
        expires_at: data.expires_at,
        paymentIntent: data.payment_intent,
        paymentStatus: data.payment_status,
        status: data.status,
        memberShipId: data.memberShipId
      })
      await this._memberShipRepository.membershipRepo.update(
        { _id: data.memberShipId},
        { users: data.customer_details.userId })
     await this._memberShipRepository.userRepo.update(
      { _id: data.customer_details.userId }, 
      { premiumUser: true }
     )
    } catch (error) {
      console.error(error)
    }
  }


}
