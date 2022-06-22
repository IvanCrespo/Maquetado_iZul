import { Component, OnInit } from '@angular/core';
import {
  NavParams,
  ToastController,
  LoadingController,
  ModalController,
  NavController,
  AlertController
} from '@ionic/angular';

/* Servicios */
import { WalletService } from 'src/app/services/wallet.service';

/* Plugins */
import { CommandsArray, StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';


@Component({
  selector: 'app-accion-wallet',
  templateUrl: './accion-wallet.page.html',
  styleUrls: ['./accion-wallet.page.scss'],
})
export class AccionWalletPage implements OnInit {
  // Data Modal View Wallet
  public accion = this.navParams.get('accion');
  public url = this.navParams.get('url');
  public s_folio = this.navParams.get('folio');
  public n_saldo_disponible = this.navParams.get('saldo');
  public id_tarjeta = this.navParams.get('id_tarjeta');

  /* Recargas y Cobros */
  total: any = 0;
  datos: any = {};
  billetes: any = [
    { billete: 20 },
    { billete: 50 },
    { billete: 100 },
    { billete: 200 },
    { billete: 500 },
  ];
  otra_cantidad: any;
  s_concepto: any;

  /* Boolean */
  other: boolean;
  dineroFijo: boolean;
  activeConcepto: boolean = false;

  /* Token */
  token: any;

  /* id_tianguis */
  id_tianguis: any;
  s_transaccion: any;

  /* Impresora */
  impresora: any;
  hoja: any;
  existImpresora: boolean = false;

  /* Seccion papel */
  commands: CommandsArray;

  /* Geolocalización */
  lat: number;
  lon: number;

  constructor(
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    public alertCtrl: AlertController,
    private starprnt: StarPRNT,
    private geolocation: Geolocation,
    private walletService: WalletService
  ) {
    if (this.url == 'cobros') {
      this.activeConcepto = true;
    }
    this.token = localStorage.getItem('token');
    this.id_tianguis = localStorage.getItem('id_tianguis');
    this.other = true;
    this.dineroFijo = true;
    this.activateImpresora();
    this.getGeolocation();
  }

  ngOnInit() { }

  async activateImpresora() {
    this.hoja = localStorage.getItem('hoja_impresora');
    this.impresora = localStorage.getItem('impresora');
    if (this.impresora) {
      this.existImpresora = true;
    }
    else if (!this.impresora) {
      const alert = await this.alertCtrl.create({
        header: `Configuración Impresora`,
        message: `No cuenta con impresora configurada para imprimir su ticket;
                  Desea seguir realizando ${this.accion} sin imprimir ticket?`,
        mode: 'ios',
        buttons: [
          {
            text: 'Configurar',
            handler: () => {
              alert.dismiss(false);
              return false;
            },
          },
          {
            text: 'Continuar',
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
          this.close(true);
        }
        else if (select == true) {
          this.existImpresora = false;
        }
      });
    }
  }

  agregarDinero(dinero: any) {
    this.total += dinero;
  }

  close(data: any) {
    this.modalCtrl.dismiss(data);
  }

  otraCantidad() {
    this.other = !this.other;
    this.dineroFijo = !this.dineroFijo;
    this.total = 0;
  }

  ionChangeCantidad(event, cantidad) {
    if (cantidad == null || cantidad == undefined) {
      this.total = 0;
    } else if (cantidad != null || cantidad != undefined) {
      this.total = cantidad;
    }
  }

  async toPay(url: any) {
    if (this.total == 0) {
      this.presentToast(`No ha ingresado dinero`, 'warning', 2500);
    } else if (url == 'cobros') {
      if (this.total > this.n_saldo_disponible) {
        this.presentToast(
          `Tu saldo disponible es de: $${this.n_saldo_disponible}, no puedes cobrar la cantidad de $${this.total}`,
          'warning',
          2500
        );
      }
      else {
        const alert = await this.alertCtrl.create({
          header: `Confirmar ${url}`,
          message: `Desea cobrar: $${this.total}?`,
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
            this.accionWallet(url);
          }
        });
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: `Confirmar ${url}`,
        message: `Desea recargar: $${this.total}?`,
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
          this.accionWallet(url);
        }
      });
    }
  }

  async accionWallet(url: any) {
    if (this.s_concepto == null || this.s_concepto == undefined) {
      this.s_concepto = "Sin concepto";
    }
    const characters = '0123456789';
    let transaccion = '';
    var num = 7;
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      transaccion += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    this.s_transaccion = 'TRAN';
    this.s_transaccion = this.s_transaccion.concat(transaccion);
    if (url == 'recargas') {
      this.datos = {
        s_folio: this.s_folio,
        s_transaccion: this.s_transaccion,
        n_monto: this.total,
        b_es_movil: '1',
        id_tianguis: this.id_tianguis,
        b_activo: '1',
        n_latitud: this.lat,
        n_longitud: this.lon
      };
    }
    else if (url == 'cobros') {
      this.datos = {
        s_folio: this.s_folio,
        s_transaccion: this.s_transaccion,
        n_monto: this.total,
        b_es_movil: '1',
        id_tianguis: this.id_tianguis,
        s_concepto: this.s_concepto,
        b_activo: '1',
        n_latitud: this.lat,
        n_longitud: this.lon,
      };
    }
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
    });
    await loading.present();
    console.log('URL: ', url);
    console.log('Info de Acción: ', this.datos);
    this.walletService.Post(this.token, url, this.datos).subscribe((data: any) => {
      if (!this.isNotErrorApiResponse(data)) {
        this.presentToast(data.message, 'danger', 2500);
        this.close(false);
        loading.dismiss();
      } else if (data.status == 'fail') {
        this.presentToast(`Error al realizar ${url}`, 'danger', 2500);
        this.close(false);
        loading.dismiss();
      } else if (data.status == 'success') {
        if (this.existImpresora == true) {
          if (this.hoja == "2") {
            this.commands = this.TicketPulg2();
          }
          else if (this.hoja == "3") {
            this.commands = this.TicketPulg3();
          }
          this.starprnt.print(this.impresora, 'StarPRNT', this.commands).then(result => {
            this.presentToast(`Exito al realizar ${url}`, 'success', 2500);
            this.close(this.id_tarjeta);
            loading.dismiss();
          }).catch(error => {
            this.presentToast(`Exito al realizar ${url}, pero su Impresora tuvo una falla, verificar`, 'success', 2500);
            this.close(this.id_tarjeta);
            loading.dismiss();
          });
        }
        if (this.existImpresora == false) {
          this.presentToast(`Exito al realizar ${url} (Sin ticket)`, 'success', 2500);
          this.close(this.id_tarjeta);
          loading.dismiss();
        }
        loading.present();
      }
    });
  }

  /* Ticket 2 Pulgadas */
  TicketPulg2(): CommandsArray {
    let threeInchReceipt: CommandsArray = [];
    threeInchReceipt.push({ appendInternational: this.starprnt.InternationalType.LatinAmerica });
    threeInchReceipt.push({ appendEncoding: this.starprnt.Encoding.UTF8 });
    threeInchReceipt.push({ appendCharacterSpace: 0 });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Center });
    threeInchReceipt.push({ appendMultiple: "iZul\n" + "\n", width: 3, height: 3 });
    threeInchReceipt.push({ appendMultiple: this.accion + "\n" + "\n", width: 1, height: 1 });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Left });
    threeInchReceipt.push({ appendEmphasis: "Folio: " });
    threeInchReceipt.push({ append: this.s_folio + "\n" });
    threeInchReceipt.push({ appendEmphasis: "Transacción: " });
    threeInchReceipt.push({ append: this.s_transaccion + "\n" + "\n" });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Center });
    threeInchReceipt.push({ append: "------------------------------------------------\n" });
    threeInchReceipt.push({ appendMultiple: "TOTAL: " + this.total, width: 2, height: 2 });
    threeInchReceipt.push({ append: "\n" });
    threeInchReceipt.push({ append: "------------------------------------------------\n" });
    threeInchReceipt.push({ append: "\n" });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Left });
    if (this.url == 'cobros') {
      threeInchReceipt.push({ appendEmphasis: "Concepto: " });
      threeInchReceipt.push({ append: this.s_concepto + "\n" });
    }
    threeInchReceipt.push({ append: "\n" + "\n" + "\n" });
    return threeInchReceipt;
  }

  /* Ticket 3 Pulgadas */
  TicketPulg3(): CommandsArray {
    let threeInchReceipt: CommandsArray = [];
    threeInchReceipt.push({ appendInternational: this.starprnt.InternationalType.LatinAmerica });
    threeInchReceipt.push({ appendEncoding: this.starprnt.Encoding.UTF8 });
    threeInchReceipt.push({ appendCharacterSpace: 0 });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Center });
    threeInchReceipt.push({ appendMultiple: "iZul\n" + "\n", width: 3, height: 3 });
    threeInchReceipt.push({ appendMultiple: this.accion + "\n" + "\n", width: 2, height: 2 });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Left });
    threeInchReceipt.push({ appendEmphasis: "Folio: " });
    threeInchReceipt.push({ append: this.s_folio + "\n" });
    threeInchReceipt.push({ appendEmphasis: "Transaccion: " });
    threeInchReceipt.push({ append: this.s_transaccion + "\n" + "\n" });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Center });
    threeInchReceipt.push({ append: "------------------------------------------------\n" });
    threeInchReceipt.push({ appendMultiple: "TOTAL: " + "$"+this.total, width: 2, height: 2 });
    threeInchReceipt.push({ append: "\n" });
    threeInchReceipt.push({ append: "------------------------------------------------\n" });
    threeInchReceipt.push({ append: "\n" });
    threeInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Left });
    if (this.url == 'cobros') {
      threeInchReceipt.push({ appendEmphasis: "Concepto: " });
      threeInchReceipt.push({ append: this.s_concepto + "\n" });
    }
    threeInchReceipt.push({ append: "\n" + "\n" + "\n" });
    return threeInchReceipt;
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
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
      position: 'top',
      cssClass: 'customToast'
    });
    toast.present();
  }
}
