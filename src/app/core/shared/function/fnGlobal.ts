import { ItemSelect } from "../../models/item-select.model";

export function getValue(code: string, ds: any[]): number {

    let id = 0;
    ds.forEach(item => {
      if(item.code == code) id = item.value;
    });

    return id;
}

export function getCode(value: number, ds: any[]): number {

    let code = 0;
    ds.forEach(item => {
      if(item.value == value) code = item.code;
    });

    return code;
}

export function dataURLtoFile(dataurl, filename): any {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}
