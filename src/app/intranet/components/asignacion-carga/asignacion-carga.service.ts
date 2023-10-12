import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable()

export class AsignacionCargaService{

    OrigenFilter: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    get getOrigenFilter():Observable<number>{
        return this.OrigenFilter.asObservable();
    }
}