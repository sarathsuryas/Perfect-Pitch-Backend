import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { memebershipSchema } from 'src/user/schema/membership.schema';
import { paymentSchema } from 'src/user/schema/payment.schema';
import { userSchema } from 'src/user/schema/user.schema';
import { MembershipController } from 'src/user/controllers/membership/membership.controller';
import { MemberShipRepository } from 'src/user/repositories/membership.repository';
import { MembershipService } from 'src/user/services/membership/membership.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'User',schema:userSchema},
    {name:'MemberShip',schema:memebershipSchema},{name:'Payment',schema:paymentSchema}]),JwtModule],
  controllers:[MembershipController],
  providers:[MemberShipRepository,MembershipService]
})
export class MembershipModule {}
