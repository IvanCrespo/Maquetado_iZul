import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';

/* Servicios */
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-home-wallet',
  templateUrl: './home-wallet.page.html',
  styleUrls: ['./home-wallet.page.scss'],
})
export class HomeWalletPage implements OnInit {

  /* Token */
  token: any;

  /* Mercado Data */
  nombre_tianguis: any;
  id_tianguis: any;

  /* Recaudaciones */
  cobros: number = 0;
  recargas: number = 0;
  total_cobros: number = 0;
  total_recargas: number = 0;
  totales: number = 0;

  /* Timer */
  timer: any;
  timerSalida: any;

  constructor(
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private walletService: WalletService
  ) {
    this.id_tianguis = localStorage.getItem('id_tianguis');
    this.token = localStorage.getItem('token');
    this.ionViewWillEnter();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.datosRecaudación();
  }

  async datosRecaudación() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      duration: 1200,
    });
    await loading.present();
    this.walletService.GetAll(this.token, `recaudacion_tianguis/${this.id_tianguis}`).subscribe(
      (data: any) => {
        console.log("Recaudaciones: ", data);
        if (!this.isNotErrorApiResponse(data)) {
          this.presentToast(data.message, 'danger', 2500);
          return false;
        }
        else if (data.status == 'warning') {
          this.presentToast(data.message, 'warning', 2500);
          return false;
        }
        else if (data.status == 'success') {
          this.nombre_tianguis = data.data.tianguis.s_nombre;
          /* Cobros */
          let cobrosMovil = data.data.tianguis.numero_cobros;
          let cobrosWeb = data.data.tianguis.numero_cobros_web;
          this.cobros = cobrosMovil + cobrosWeb;
          /* Recargas */
          let recargasMovil = data.data.tianguis.numero_recargas;
          let recargasWeb = data.data.tianguis.numero_recargas_web;
          this.recargas = recargasMovil + recargasWeb;
          /* Total Cobros */
          let total_cobrosMovil = data.data.tianguis.total_cobros;
          let total_cobrosWeb = data.data.tianguis.total_cobros_web;
          this.total_cobros = total_cobrosMovil + total_cobrosWeb;
          /* Total Recargas */
          let total_recargasMovil = data.data.tianguis.total_recargas;
          let total_recargasWeb = data.data.tianguis.total_recargas_web;
          this.total_recargas = total_recargasMovil + total_recargasWeb;
          /* Totales */
          this.totales = this.total_recargas;
        }
      });
  }

  async changeTianguis(){
    const alert = await this.alertCtrl.create({
      header: 'Cambiar Tianguis',
      message: `Seguro que quiere cambiar el tianguis ${this.nombre_tianguis}?"`,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            alert.dismiss(false);
            return false;
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            alert.dismiss(true);
            return false;
          },
        },
      ],
    });
    await alert.present();
    const loading = await this.loadingCtrl.create({
      message: 'Cambiando...',
      duration: 1000,
    });
    await alert.onDidDismiss().then((data) => {
      let select = data.data;
      if (select == undefined || select == false) {
        return false;
      }
      else if (select == true) {
        if (this.timerSalida) clearTimeout(this.timerSalida);
        let self = this;
        this.timerSalida = setTimeout(function () {
          loading.present();
          self.navCtrl.navigateRoot("/tianguis-wallet");
        }, 700);
      }
    });
    loading.dismiss();
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
