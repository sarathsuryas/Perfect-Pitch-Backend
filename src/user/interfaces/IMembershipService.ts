import { PaymentSuccessDto } from '../dtos/paymentSuccess.dto';
import { IMemberShip } from './IMemberShip';

export interface IMembershipService {
  getMemberShip(): Promise<IMemberShip[]>;
  checkActiveMemberShip(userId: string): Promise<boolean>;
  createSession(params: string, userId: string): Promise<string>;
  paymentSuccess(data: PaymentSuccessDto): Promise<void>;
}
