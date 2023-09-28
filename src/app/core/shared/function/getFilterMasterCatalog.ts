
import { inject } from "@angular/core";
import { ItemSelect } from "../../models/item-select.model";
import { LocalService } from "../services/local.service";

export function getFilterMasterCatalog(Grupo: string): ItemSelect<number>[] {

    const _localService = inject(LocalService);
    let cm = _localService.getData("sicucm");
    let Lista = JSON.parse(cm);

    let list: ItemSelect<number>[] = [{ value: 0, text: 'Seleccione' }];
    
    Lista.forEach(item => {
        if(item.grupo == Grupo){
            list.push({
                value: item.id,
                text: item.nombre,
                code: item.orden
            });
        };
    });

    return list;
}
