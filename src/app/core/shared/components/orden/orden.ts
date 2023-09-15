import PaymentType from "./enum/payment-type";
import IPaymentMethod from "./interface/payment-method-interface";
import PaymentMethodFactory from "./payment-metohd-factory";

export default class Orden {
    public paymentType?: IPaymentMethod;
    public comission: number = 0;

    constructor(
        private type: PaymentType,
        public amount: number
    ){}

    public create(): void {
        this.paymentType = PaymentMethodFactory.createPaymentType(this.type);

        this.comission = this.paymentType.comission * this.amount;
    }

}