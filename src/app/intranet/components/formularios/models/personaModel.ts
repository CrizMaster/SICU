import { InteresadoResponse } from "./interesadoRequest";
import { PersonaLegalModel } from "./personaLegalModel";
import { PersonaNaturalModel } from "./personaNaturalModel";


export interface PersonaModel {
    codigoContribuyente?: string,
    sucesion?: string,
    displayName?: string,
    ConConyuge?: boolean,
    Titular?: PersonaNaturalModel,
    Conyuge?: PersonaNaturalModel,
    Empresa?: PersonaLegalModel,
    Interesado?: InteresadoResponse
}