import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Base64WriteImage } from '../model/base64-image';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public upload(fileInfo: Base64WriteImage):Promise<Boolean> {
    return new Promise(resolve =>{
      if(fileInfo) {

        const api = '/api/base64/image/v1/write';
        const data = new Base64WriteImage();
        data.base64          = fileInfo.base64;
        data.file_name       = fileInfo.file_name;
        data.file_size       = fileInfo.file_size;
        data.file_type       = fileInfo.file_type;
        data.file_extension  = fileInfo.file_extension;
        data.id              = fileInfo.id;

        const dataBody = JSON.stringify(fileInfo);
        console.log('data', dataBody);
        // const encryptionData = this.cryptoService.encrypt(dataBody);
        const requestData = {
          body: data
        };

          console.log('encryptionData', JSON.stringify(requestData));

        // this.server.HTTPPost(api, data).then(resp => {
        //   if ( resp && resp.body.status === Reponse_Status.Y) {
        //       resolve(true);
        //   } else {
        //     resolve(false);
        //   }
        // });
      }
    });
  }

}
