import { Component } from '@angular/core';
import { Platform, ToastController, AlertController } from '@ionic/angular';
/* Servicios */
import { NetworkService } from './services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isConnected: any;

  constructor(
    private netService: NetworkService,
    private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      this.networkSubscribe();
    })
  }

  networkSubscribe(): void {
    this.netService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      localStorage.setItem('conexion', this.isConnected);
      console.log(this.isConnected);
      if (this.isConnected == true) {
        return;
      }
      else if (this.isConnected == false) {
        this.presentAlert();
      }
    });
  }


  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Conexión a Internet',
      message: 'Modo: Offline. Algunas funciones no podran ser usadas hasta que tengas conexión a Internet.',
      buttons: ['Cancel', 'Open Modal', 'Delete']
    });

    await alert.present();
  }
}
