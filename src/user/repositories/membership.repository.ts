import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaymentSuccessDto } from "src/user/dtos/paymentSuccess.dto";
import { MemberShip } from "src/user/schema/membership.schema";
import { Payment } from "src/user/schema/payment.schema";
import { User } from "src/user/schema/user.schema";
import { IMemberShip } from "../interfaces/IMemberShip";
import { BaseRepository } from "./base.repository";

@Injectable()
export class MemberShipRepository {
  constructor(@InjectModel('MemberShip') private _memberShipModel: Model<MemberShip>,
  @InjectModel('Payment') private _paymentModel: Model<Payment>, @InjectModel('User') private readonly _userModel: Model<User>) { 
  }
  public membershipRepo = new BaseRepository<MemberShip>(this._memberShipModel)
  public paymentRepo = new BaseRepository<Payment>(this._paymentModel)
  public userRepo = new BaseRepository<User>(this._userModel)

  // async paymentSuccess(data: PaymentSuccessDto):Promise<void> {
  //   try {
  //     await this._paymentModel.create({
  //       paymentId: data.id,
  //       amount: data.amount_subtotal / 100,
  //       userId: data.customer_details.userId,
  //       email: data.customer_details.email,
  //       name: data.customer_details.name,
  //       valid: true,
  //       expires_at: data.expires_at,
  //       paymentIntent: data.payment_intent,
  //       paymentStatus: data.payment_status,
  //       status: data.status,
  //       memberShipId: data.memberShipId
  //     })
  //     await this._memberShipModel.findOneAndUpdate({ _id: data.memberShipId, }, { users: data.customer_details.userId })
  //     await this._userModel.findOneAndUpdate({ _id: data.customer_details.userId }, { premiumUser: true })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // async getMemberShip():Promise<IMemberShip[]> {
  //   try {
  //     return await this._memberShipModel.find({ isBlocked: false }).lean()
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }




  // async checkActiveMemberShip(userId: string):Promise<boolean> {
  //   try {
  //     const data = await this._paymentModel.findOne({ userId: userId })
  //     if (data) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
}