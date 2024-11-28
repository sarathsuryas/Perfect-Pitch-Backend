export interface PaymentSuccessDto {
id:string;
memberShipId:string;
amount_subtotal:number
created:number;
currency:string
customer_details:{
  email: string,
  name: string,
  userId:string
}
expires_at:number;
payment_intent:string;
payment_status:string;
payment_method_types:string[];
status:string
}


