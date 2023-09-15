import PaymentType from "./enum/payment-type";
import IPaymentMethod from "./interface/payment-method-interface";
import MasterCard from "./type/masterCard";
import PayPal from "./type/palPal";
import Visa from "./type/visa";

export default class PaymentMethodFactory {
    //static: no hace falta instanciarlo
    public static createPaymentType(type: PaymentType): IPaymentMethod{
        if(type == PaymentType.MasterCard){
            return new MasterCard();
        }

        if(type == PaymentType.PayPal){
            return new PayPal();
        }

        if(type == PaymentType.Visa){
            return new Visa();
        }

        throw new Error("Tipo de método de pago inválido");
    }
}