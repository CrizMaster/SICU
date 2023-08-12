import { FichaCatastral } from "./fichaCatastral.model";

export interface FichaCatastralResponse {
    total: number,
    data: FichaCatastral[]
}