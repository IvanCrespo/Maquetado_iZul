import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';

/* Servicios */
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-tianguis-wallet',
  templateUrl: './tianguis-wallet.page.html',
  styleUrls: ['./tianguis-wallet.page.scss'],
})
export class TianguisWalletPage implements OnInit {

  /* URL's */
  private urlTianguis = 'tianguis';

  /* Token */
  token: any;

  /* Lista Tianguis */
  tianguis: any;
  filter: string;

  constructor(
    private walletService: WalletService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    public alertCtrl: AlertController
  ) {
    this.token = localStorage.getItem('token');
    this.walletService.GetAll(this.token, this.urlTianguis).subscribe((data: any) => {
      console.log('All Tianguis: ', data);
      if (!this.isNotErrorApiResponse(data)) {
        this.presentToast(data.message, 'danger', 2500);
        return false;
      }
      else if (data.status == 'warning') {
        this.presentToast(data.message, 'warning', 2500);
        return false;
      }
      else if (data.status == 'success') {
        this.tianguis = data.data.tianguis;
      }
    });
  }

  ngOnInit() {
  }

  async selectTianguis(id_tianguis: any, nombre_tianguis: any) {
    console.log('Tianguis seleccionado: ', id_tianguis, nombre_tianguis);
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Tianguis',
      message: `Seguro que quiere elegir el tianguis "${nombre_tianguis}"`,
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
    await alert.onDidDismiss().then((data) => {
      let select = data.data;
      if (select == undefined || select == false) {
        return false;
      }
      else if (select == true) {
        localStorage.setItem('id_tianguis', id_tianguis);
        this.navCtrl.navigateRoot("/tabs");
      }

    });
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
      position: 'top'
    });
    toast.present();
  }
}
