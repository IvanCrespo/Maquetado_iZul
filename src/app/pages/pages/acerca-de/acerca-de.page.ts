import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';

/* Plugins */
import { StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.page.html',
  styleUrls: ['./acerca-de.page.scss'],
})
export class AcercaDePage implements OnInit {

  /* Impresora */
  impresoras: any = [];
  portName: any;
  size_papel: any;

  /* Timer */
  timer: any;

  constructor(
    private starprnt: StarPRNT,
    private bluetoothSerial: BluetoothSerial,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    this.ionViewWillEnter();
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.bluetoothPrincipal();
  }

  bluetoothPrincipal() {
    this.bluetoothSerial.isEnabled().then(
      () => {
        this.cargarImpresoras();
      },
      () => {
        this.enableBluetooth();
      }
    )
  }

  enableBluetooth() {
    this.bluetoothSerial.enable().then(
      () => {
        this.presentToast(`Bluetooth Activado`, 'success', 2500);
        if (this.timer) clearTimeout(this.timer);
        let self = this;
        this.timer = setTimeout(function () {
          self.cargarImpresoras();
        }, 1000);
      }, () => {
        this.presentToast(`No se habilito el Bluetooth. No podra imprimir tickets de sus recaudaciones.`, 'warning', 2500);
      }
    );
  }

  async cargarImpresoras() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando Impresoras...',
    });
    await loading.present();
    this.starprnt.portDiscovery('all')
      .then((data: any) => {
        if (data == null || data == undefined) {
          this.presentToast(
            `Sin impresoras, verifique que este habilitado el Bluetooth`,
            'warning',
            2500
          );
          loading.dismiss();
        }
        else if (data != null || data != undefined) {
          this.impresoras = data;
          this.presentToast(
            `Impresoras cargadas`,
            'success',
            2500
          );
          loading.dismiss();
        }
      });
  }

  reload() {
    this.bluetoothPrincipal();
  }

  saveConfig() {
    if (this.portName == null || this.portName == undefined) {
      this.presentToast(
        `No ha seleccionado ninguna Impresora`,
        'warning',
        2500
      );
    }
    else if (this.size_papel == null || this.size_papel == undefined) {
      this.presentToast(
        `No ha seleccionado el tamaño de papel`
        , 'warning',
        2500);
    }
    else {
      localStorage.setItem('hoja_impresora', this.size_papel);
      localStorage.setItem('impresora', this.portName);
      this.presentToast(
        `Configuración guardada`,
        'success',
        2500
      );
    }
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
