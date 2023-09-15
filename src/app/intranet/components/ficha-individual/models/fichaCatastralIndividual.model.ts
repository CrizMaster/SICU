import { AdditionalWorksRequest } from "./AdditionalWorks/additions-works-request.model";
import { BuildingsRequest } from "./Buildings/buildings-request.model";
import { DescriptionPropertyRequest } from "./DescriptionProperty/description-property-request.model";
import { IdentityOwnerRequest } from "./IdentityOwner/identity-owner-request.model";
import { OwnershipCharacteristicsRequest } from "./OwnershipCharacteristics/ownership-characteristics-request.model";
import { SaveFichaIndividual, UbicacionPredioModel } from "./saveFichaIndividual.model";

export interface FichaCatastralIndividual {
    idObjeto?: number,
    seccion1?: SaveFichaIndividual,
    seccion2?: UbicacionPredioModel,
    seccion3?: OwnershipCharacteristicsRequest
    seccion4?: IdentityOwnerRequest,
    seccion5?: DescriptionPropertyRequest,
    seccion6?: BuildingsRequest[],
    seccion7?: AdditionalWorksRequest[]
}