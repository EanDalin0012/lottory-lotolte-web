import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonipService {
  constructor(private http: HttpClient) { }
  public jsonIp(): Promise<string> {
      return new Promise( resolve => {
        this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
        resolve(res.ip);
      });

      });
  }
}
