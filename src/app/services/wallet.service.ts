import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { conexion } from './conexion';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private http: HttpClient
  ) { }

  GetAll(s_token: string, url: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Licencia': conexion.licencia,
      'Token': s_token
    });
    let options = { headers: headers };
    return this.http.get(conexion.url + url, options);
  }

  Post(s_token: string, url: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Licencia': conexion.licencia,
      'Token': s_token
    });
    console.log('URL: ', url);
    console.log('Datos POST: ', data);
    let options = { headers: headers };
    return this.http.post(conexion.url + url, data, options);
  }

  AllById(s_token: string, url: string, id: number) {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Licencia': conexion.licencia,
        'Token': s_token
     });
    console.log('URL: ', url);
    let options = { headers: headers };
    return this.http.get(conexion.url + url + "/" + id, options);    
  }
}
