import PaymentType from "./enum/payment-type";
import Orden from "./orden";
import MasterCard from "./type/masterCard";
import PayPal from "./type/palPal";
import Visa from "./type/visa";

let orden1 = new Orden(PaymentType.Visa, 100),
    orden2 = new Orden(PaymentType.MasterCard, 100),
    orden3 = new Orden(PaymentType.PayPal, 100);

orden1.create();
orden2.create();
orden3.create();

describe("Orden - Visa", () => {
    it("Orden debe de pagarse mediante VISA", () => {
        expect(true)
        .toEqual(orden1.paymentType instanceof Visa);
    });

    it("La comisión de la orden debe de ser 5",() => {
        expect(5).toEqual(orden1.comission);
    });
});

describe("Orden - MasterCard", () => {
    it("Orden debe de pagarse mediante MasterCard", () => {
        expect(true)
        .toEqual(orden2.paymentType instanceof MasterCard);
    });

    it("La comisión de la orden debe de ser 4",() => {
        expect(4).toEqual(orden2.comission);
    });
});

describe("Orden - PayPal", () => {
    it("Orden debe de pagarse mediante PayPal", () => {
        expect(true)
        .toEqual(orden3.paymentType instanceof PayPal);
    });

    it("La comisión de la orden debe de ser 6",() => {
        expect(6).toEqual(orden3.comission);
    });
});