import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import configuration from 'src/config/configuration';
import { storeError } from 'src/errorStore/storeError';
import { ICustomRequest } from 'src/admin/interfaces/ICustomRequest';
import { PaymentSuccessDto } from 'src/user/dtos/paymentSuccess.dto';
import { UserAuthenticationGuard } from 'src/user/user-auth-guard/user-authentication.guard';
import { MembershipService } from 'src/user/services/membership/membership.service';
import Stripe from 'stripe';

@Controller('membership')
export class MembershipController {
  constructor(private _memberShipService:MembershipService) {}
  @UseGuards(UserAuthenticationGuard)
  @Post('create-checkout-session')
  async StripePayment(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._memberShipService.createSession(req.body.priceId, req.user._id)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }
  @UseGuards(UserAuthenticationGuard)
  @Post('payment-success')
  async paymentSuccess(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const stripe = new Stripe(configuration().stripe_secret_key);
      const session = await stripe.checkout.sessions.retrieve(req.body.sessionId)
      const dtoObject: PaymentSuccessDto = {
        id: session.id,
        amount_subtotal: session.amount_subtotal,
        created: session.created,
        currency: session.currency,
        customer_details: {
          email: session.customer_details.email,
          name: session.customer_details.email,
          userId: req.user._id
        },
        expires_at: session.expires_at,
        payment_intent: session.payment_intent as string,
        payment_status: session.payment_status,
        payment_method_types: session.payment_method_types,
        status: session.status,
        memberShipId: req.body.memberShipId
      }
      await this._memberShipService.paymentSuccess(dtoObject)
      res.status(HttpStatus.OK).json(session)
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(UserAuthenticationGuard)
  @Get('get-membership')
  async getMemberShip(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const data = await this._memberShipService.getMemberShip()
      const userId = req.user._id
      res.status(HttpStatus.OK).json({ data, userId })
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }


  @UseGuards(UserAuthenticationGuard)
  @Post('check-active-membership')
  async checkActiveMemberShip(@Body() data: { userId: string }, @Res() res: Response) {
    try {
      const result = await this._memberShipService.checkActiveMemberShip(data.userId)
      if (result) {
        res.status(HttpStatus.OK).json(result)
      } else {
        res.status(HttpStatus.OK).json(result)
      }
    } catch (error) {
      console.error(error)
      storeError(error, new Date())
      throw new InternalServerErrorException()
    }
  }


}
