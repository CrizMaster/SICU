
import { inject } from "@angular/core";
import { ItemSelect } from "../../models/item-select.model";
import { LocalService } from "../services/local.service";

export function fnFilterMasterCatalog(Grupo: number): ItemSelect<number>[] {

    const _localService = inject(LocalService);
    let cm = _localService.getData("catmaster");
    let Lista = JSON.parse(cm);

    let list: ItemSelect<number>[] = [{ value: 0, text: 'seleccionar' }];
    
    Lista.forEach(item => {
        if(item.codigoGrupoCatalogo == Grupo){
            list.push({
                value: item.idCatalogo,
                text: item.nombreCatalogo,
                code: item.codigoCatalogo
            });
        };
    });

    return list;
}
