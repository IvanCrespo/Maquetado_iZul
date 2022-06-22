import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController, NavController } from '@ionic/angular';

/* Servicios */
import { WalletService } from 'src/app/services/wallet.service';

/* Modals */
import { AccionWalletPage } from '../accion-wallet/accion-wallet.page';

@Component({
  selector: 'app-view-wallet',
  templateUrl: './view-wallet.page.html',
  styleUrls: ['./view-wallet.page.scss'],
})
export class ViewWalletPage implements OnInit {
  // Data de QR Escaneado
  public tarjeta = this.navParams.get('tarjeta');

  /* Tarjetas */
  s_folio: any;
  s_folio_encrypt: any;
  n_saldo_disponible: any;
  id_tarjeta: any;
  s_folio_encrypt_mostrar: any;

  /* Token */
  token: any;

  /* URL Services */
  private urlTarjetas = 'tarjetas';


  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private walletService: WalletService
  ) {
    this.token = localStorage.getItem('token');
    if (this.tarjeta != undefined) {
      this.cargarTarjeta(this.tarjeta.id_tarjeta);
    }
  }

  ngOnInit() { }

  async cargarTarjeta(id: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      duration: 1000,
    });
    await loading.present();
    this.walletService
      .AllById(this.token, this.urlTarjetas, id)
      .subscribe((data: any) => {
        console.log('Datos de Tarjeta View: ', data);
        if (!this.isNotErrorApiResponse(data)) {
          this.presentToast(data.message, 'danger', 2500);
          loading.dismiss();
          return false;
        }
        else if (data.status == 'warning') {
          this.presentToast(data.message, 'warning', 2500);
          loading.dismiss();
          return false;
        }
        else if (data.status == 'success') {
          let folio = data.data.tarjetas.s_folio;
          this.s_folio = folio.replace(folio, "*******");
          let folio_s = data.data.tarjetas.s_folio_encrypt;
          this.s_folio_encrypt_mostrar = folio_s.substring(20);
          this.s_folio_encrypt = data.data.tarjetas.s_folio_encrypt;
          this.n_saldo_disponible = data.data.tarjetas.n_saldo_disponible;
          this.id_tarjeta = data.data.tarjetas.id_tarjeta;
          loading.dismiss();
        }
      });
    loading.present();
  }

  close(data: any) {
    this.modalCtrl.dismiss(data);
  }

  /* Modal para recargar tarjeta */
  async accion(accion: string, url: any) {
    let modal = await this.modalCtrl.create({
      component: AccionWalletPage,
      componentProps: {
        accion: accion,
        url: url,
        folio: this.s_folio_encrypt,
        saldo: this.n_saldo_disponible,
        id_tarjeta: this.id_tarjeta
      },
    });
    modal.onDidDismiss().then((data: any) => {
      if (data.data == false || data.data == null || data.data == undefined) {
        return false;
      } else if (data.data != false || data.data != null || data.data != undefined) {
        /* var id = data.data;
        this.cargarTarjeta(id); */
        this.close(false);
      }
    });
    return await modal.present();
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
