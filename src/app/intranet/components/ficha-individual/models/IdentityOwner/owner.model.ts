import { PersonLegal } from "./personLegal.model";
import { PersonNatural } from "./personNatural.model";

export interface Owner {
    ConConyuge?: boolean,
    Titular?: PersonNatural,
    Conyuge?: PersonNatural,
    Empresa?: PersonLegal
}