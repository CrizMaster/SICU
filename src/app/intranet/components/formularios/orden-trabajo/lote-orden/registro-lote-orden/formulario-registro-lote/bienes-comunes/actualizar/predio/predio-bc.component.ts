import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagenModel } from 'src/app/core/models/imagen.model';
import { ItemSelect } from 'src/app/core/models/item-select.model';
import { ImageViewerComponent } from 'src/app/core/shared/components/image-viewer/image-viewer.component';
import { CatalogoMasterEnum } from 'src/app/core/shared/enum/catalogo-master.enum';
import { getFilterMasterCatalog } from 'src/app/core/shared/function/getFilterMasterCatalog';

@Component({
    selector: 'app-predio-bc',
    templateUrl: './predio-bc.component.html',
    styleUrls: ['./predio-bc.component.css']
})
export class PredioBcComponent implements OnInit {

    form : FormGroup;
    expanding: boolean = true;
    public imagenes: ImagenModel[] = [];

    pattern1Digs = '^[1-9]|([1-9][0-9])$';
    pattern2Digs = '^((?!00).)*$';
    pattern3Digs = '^((?!000).)*$'; 

    listPartidaRegistral: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listTipoDocumento: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listClasificacionPrecio: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listPredioCatastralEn: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    listCodigoEnUso: ItemSelect<number>[] = [{ value:0, text:'Seleccionar' }];
    
    constructor(
        private route: Router,
        private _activatedRoute:ActivatedRoute,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ){
        this.form = this.fb.group({
            partidaregistral: [0, Validators.required],
            numeropartida: ['', Validators.required],
            tipodocidentidad: [0, Validators.required],
            numerodocumento: ['', Validators.required],
            clasificacionpredio: [0, Validators.required],
            prediocatastralen: [0, Validators.required],
            areaterreno: ['', Validators.required],
            codigoenuso: [0, Validators.required],
            descripcionuso: ['', Validators.required],
          });

        this.listPartidaRegistral = getFilterMasterCatalog(CatalogoMasterEnum.TipoPartidaRegistral);
        this.listTipoDocumento = getFilterMasterCatalog(CatalogoMasterEnum.TipoDocumentoTitularidad); 
        this.listClasificacionPrecio = getFilterMasterCatalog(CatalogoMasterEnum.ClasificacionPredio);
        this.listPredioCatastralEn = getFilterMasterCatalog(CatalogoMasterEnum.PrecioCatastradoEn);
        this.listCodigoEnUso = getFilterMasterCatalog(CatalogoMasterEnum.PredioCodigoUso);        
    }

    ngOnInit(): void {
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }    

    quitarImagen(img: ImagenModel){
        let listaImagenes: ImagenModel[] = [];
        this.imagenes.forEach(el => {
            if(el.id != img.id) listaImagenes.push(el);
        });

        this.imagenes = listaImagenes;
    }

    capturarFile(event){
        
        let idmax: number = 0;
        let total = event.target.files.length;

        if(this.imagenes.length > 0){
            idmax = Math.max.apply(Math, this.imagenes.map(function(o) { return o.id; }));
        }

        for (let i = 0; i < total; i++) {
            const archivoCapturado = event.target.files[i];
            this.extraerBase64(archivoCapturado).then((imagen: any) => {
                //this.previsualizacion = imagen.base;
    
                this.imagenes.push({
                    id: idmax + i + 1,
                    name: archivoCapturado.name,
                    tamanioBytes: archivoCapturado.size,
                    tamanio: Math.floor(archivoCapturado.size / 1024 ) + ' KB',
                    type: archivoCapturado.type,
                    base64: imagen.base,
                    imagen: archivoCapturado
                });
            }); 
        }
    }

    extraerBase64 = async($event: any) => new Promise((resolve, reject) => {
        try{
            const reader = new FileReader();
            reader.readAsDataURL($event);
            reader.onload = () => {
                resolve({
                    base: reader.result
                });
            };
            reader.onerror = error => {
                resolve({
                    base: null
                })
            }
        } catch(e){
            return null;
        }
    });

    verImagen(e, img){
        let dgRef = this.dialog.open(ImageViewerComponent, {
            width: 'auto',
            height: 'auto',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            disableClose: true,
            data: img
        }); 
        
        e.stopPropagation();
        e.preventDefault();
      }

    limpiar(){}
    guardar(){}
    

}