import { OrdenTrabajo } from "./ordenTrabajo.model";

export interface OrdenTrabajoResponse {
    total: number,
    data: OrdenTrabajo[]
}