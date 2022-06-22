import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { conexion } from './conexion';
import { NavController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  /* Iniciar con nulo para filtrar el primer valor en un Guard */
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token: any;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await localStorage.getItem('token');
    if (token) {
      console.log('set token: ', token);
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { user, password }): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Licencia': conexion.licencia
    });
    let options = { headers: headers };
    let url = conexion.url + "login";

    return this.http.post(url, credentials, options).pipe(
      map((data: any) => {
        if (!this.isNotErrorApiResponse(data)) {
          this.presentToast(data.message, 'danger', 2500);
          return false;
        }
        else if (data.status == 'warning') {
          this.presentToast(data.message, 'warning', 2500);
          return false;
        }
        else if (data.status == 'success') {
          localStorage.setItem('token', data.data.s_token);
          return data;
        }
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  logout(): Promise<void> {
    this.presentToast(`Sesión Finalizada`, 'success', 2500);
    this.isAuthenticated.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id_tianguis');
    localStorage.removeItem('hoja_impresora');
    localStorage.removeItem('impresora');
    localStorage.removeItem('conexion');
    return;
  }

  /* Errores APIS Status */
  isNotErrorApiResponse(response: any): boolean {
    if (response.status == 'empty') return false;
    if (response.status == 'fail') return false;
    if (response.status == 'logout') {
      localStorage.clear();
      this.navCtrl.navigateRoot("/login");
      return false;
    }
    return true;
  }

  /* Mostrar Mensaje Toast */
  async presentToast(message: string, color: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration,
      position: 'top',
      cssClass: 'customToast'
    });
    toast.present();
  }
}
