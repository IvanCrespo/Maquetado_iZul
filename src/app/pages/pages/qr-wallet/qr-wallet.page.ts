import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, ModalController, NavController, AlertController } from '@ionic/angular';

/* Plugins */
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';

/* Servicios */
import { WalletService } from 'src/app/services/wallet.service';

/* Modals */
import { ViewWalletPage } from '../../modals/view-wallet/view-wallet.page';

@Component({
  selector: 'app-qr-wallet',
  templateUrl: './qr-wallet.page.html',
  styleUrls: ['./qr-wallet.page.scss'],
})
export class QrWalletPage implements OnInit {

  /* Scanner */
  scannedData: any;
  formatoData: any;
  textQR: any;

  /* Tiempo */
  timer: any;

  /* Token */
  token: any;

  /* Geolocalización */
  lat: number;
  lon: number;

  /* id_tianguis */
  id_tianguis: any;
  
  constructor(
    private scanner: BarcodeScanner,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private walletService: WalletService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.token = localStorage.getItem('token');
    this.id_tianguis = localStorage.getItem('id_tianguis');
  }

  ngOnInit() {
  }

  scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Enfoque el código QR con la cámara',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      orientation: 'portrait',
    };
    this.scanner
      .scan(options)
      .then((barcodeData) => {
        this.scannedData = JSON.stringify(barcodeData.text);
        this.formatoData = JSON.stringify(barcodeData.format);
        const newTextQR = this.scannedData.replace(/["']/g, '');
        /* Funcion para verificar caracteres de tarjeta */
        var decode = newTextQR.charAt(0);
        if (decode == '}') {
          this.textQR = newTextQR.substring(7);
        }
        else if (decode != '}') {
          this.textQR = newTextQR;
        }
        this.searchScanner(this.textQR);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  async searchScanner(textQR: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      duration: 1200,
    });
    let folio = {
      s_folio: textQR
    }
    await loading.present();
    if (this.timer) clearTimeout(this.timer);
    let self = this;
    this.timer = setTimeout(function () {
      console.log("Folio a Buscar: ", folio);
      self.walletService.Post(self.token, 'busca_folio', folio).subscribe((data: any) => {
        console.log('Datos encontrados Tarjeta: ', data);
        if (!self.isNotErrorApiResponse(data)) {
          self.presentToast(
            `Falla QR`,
            'danger',
            2500
          );
          loading.dismiss();
          return false;
        }
        else if (data.status == 'warning') {
          self.presentToast(
            `Tarjeta no encontrada`,
            'warning',
            2500
          );
          loading.dismiss();
        }
        else if (data.status == 'success') {
          self.presentToast(
            `Tarjeta encontrada`,
            'success',
            2500
          );
          loading.dismiss();
          self.verificaActivacionTarjeta(data.data.tarjetas, folio);
        }
      });
    }, 1500);
  }

  async verificaActivacionTarjeta(vtarjeta: any, folio_activar: any) {
    let datosTarjeta = vtarjeta;
    if (datosTarjeta.b_por_activar == 0) {
      this.modalViewTarjeta(datosTarjeta);
    }
    else if (datosTarjeta.b_por_activar == 1) {
      const alert = await this.alertCtrl.create({
        header: `Tarjeta Inactiva`,
        message: `Desea activar esta tarjeta?`,
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
            text: 'Activar',
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
          this.presentToast(
            `Tarjeta Cancelada`,
            'warning',
            2500
          );
          return false;
        }
        else if (select == true) {
          let datos = {
            s_folio: folio_activar,
            b_es_movil: '1',
            n_latitud: this.lat,
            n_longitud: this.lon,
            id_tianguis: this.id_tianguis
          };
          console.log('Datos de Tarjeta a Activar: ', datos);
          this.walletService.Post(this.token, 'activa_tarjeta', datos).subscribe((data: any) => {
            console.log(data);
            if (!this.isNotErrorApiResponse(data)) {
              this.presentToast(
                `Error`,
                'danger',
                2500
              );
              return false;
            }
            else if (data.status == 'warning') {
              this.presentToast(
                `Error al Activar`,
                'warning',
                2500
              );
              return false;
            }
            else if (data.status == 'success') {
              this.presentToast(
                `Tarjeta Activada`,
                'warning',
                2500
              );
              this.modalViewTarjeta(datosTarjeta);
            }
          });
        }
      });
    }
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
    });
  }

  /* Modal para mostrar tarjeta escaneada */
  async modalViewTarjeta(dataTarjeta: string) {
    let tarjeta = dataTarjeta;
    let modal = await this.modalCtrl.create({
      component: ViewWalletPage,
      componentProps: { tarjeta: tarjeta },
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
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
