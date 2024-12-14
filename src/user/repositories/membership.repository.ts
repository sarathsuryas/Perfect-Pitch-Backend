import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MemberShip } from "src/user/schema/membership.schema";
import { Payment } from "src/user/schema/payment.schema";
import { User } from "src/user/schema/user.schema";
import { BaseRepository } from "./base.repository";

@Injectable()
export class MemberShipRepository {
  constructor(@InjectModel('MemberShip') private _memberShipModel: Model<MemberShip>,
  @InjectModel('Payment') private _paymentModel: Model<Payment>, @InjectModel('User') private readonly _userModel: Model<User>) { 
  }
  public membershipRepo = new BaseRepository<MemberShip>(this._memberShipModel)
  public paymentRepo = new BaseRepository<Payment>(this._paymentModel)
  public userRepo = new BaseRepository<User>(this._userModel)

  
}