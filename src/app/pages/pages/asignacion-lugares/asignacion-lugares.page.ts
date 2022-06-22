import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';

// Modals
import { RegistroAsignacionPage } from '../../modals/registro-asignacion/registro-asignacion.page';

@Component({
  selector: 'app-asignacion-lugares',
  templateUrl: './asignacion-lugares.page.html',
  styleUrls: ['./asignacion-lugares.page.scss'],
})
export class AsignacionLugaresPage implements OnInit {

  /* Lista Tianguis */
  tianguis: any = [
    { id_nombre: 1, s_nombre_tianguis: "Tianguis Agricola" },
    { id_nombre: 2, s_nombre_tianguis: "Tianguis ABCD" },
    { id_nombre: 3, s_nombre_tianguis: "Tianguis San Pedro" },
    { id_nombre: 4, s_nombre_tianguis: "Tianguis El Colibri" }
  ];

  lugares: any = [
    { id_lugar: 1, s_nombre_lugar: "D0158-C2-00", metros: 2 },
    { id_lugar: 2, s_nombre_lugar: "D0189-C3-01", metros: 4 },
    { id_lugar: 3, s_nombre_lugar: "E1239-C4-11", metros: 4 },
    { id_lugar: 4, s_nombre_lugar: "F0489-C5-28", metros: 8 },
    { id_lugar: 5, s_nombre_lugar: "F0489-C5-30", metros: 6 },
    { id_lugar: 6, s_nombre_lugar: "H0133-C1-02", metros: 2 },
    { id_lugar: 7, s_nombre_lugar: "H0344-C3-19", metros: 3 },
    { id_lugar: 8, s_nombre_lugar: "J6901-C4-05", metros: 1 },
    { id_lugar: 9, s_nombre_lugar: "L0049-C5-23", metros: 10 }
  ];

  selected_idTianguis: number = 0;
  nombreTianguis: string = '';
  selected_idLugar: number = 0;
  nombreLugar: string = '';
  metros: number = 0;

  datos: any = {};

  // Para activar primer card
  activateTianguis: boolean = true;

  // Para activar segundo card
  activateLugares: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  escogerTianguis(id_tianguis, nombre_tianguis) {
    const id = document.querySelector('#demoTianguis' + id_tianguis);
    const background = document.querySelector('.myBackground');
    if (background) {
      background.classList.remove("myBackground");
      this.selected_idTianguis = 0;
      this.nombreTianguis = '';
    }
    else {
      id.classList.add("myBackground");
      this.selected_idTianguis = id_tianguis;
      this.nombreTianguis = nombre_tianguis;
    }
  }

  async escogerLugar(id_lugar, nombreLugar, metros) {
    const id = document.querySelector('#demoLugares' + id_lugar);
    const background = document.querySelector('.myBackgroundLugares');
    if (background) {
      background.classList.remove("myBackgroundLugares");
      this.selected_idLugar = 0;
      this.nombreLugar = '';
      this.metros = 0;
    }
    else {
      id.classList.add("myBackgroundLugares");
      this.selected_idLugar = id_lugar;
      this.nombreLugar = nombreLugar;
      this.metros = metros;
      const alert = await this.alertCtrl.create({
        header: 'Confirmar Lugar',
        message: `¿Se asignará la dimensión total del lugar?`,
        mode: 'ios',
        buttons: [
          {
            text: 'No',
            handler: () => {
              alert.dismiss(false);
              return false;
            },
          },
          {
            text: 'Si',
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
        if (select == true) {
          this.datos = {
            id_tianguis: this.selected_idTianguis,
            nombre_tianguis: this.nombreTianguis,
            id_lugar: this.selected_idLugar,
            nombre_lugar: this.nombreLugar,
            metros: this.metros
          }
          console.log(this.datos);
        }
        else {

        }
      });
    }
  }

  async seleccionarTianguis() {
    console.log("Datos a enviar: ", this.selected_idTianguis, this.nombreTianguis);
    if (this.selected_idTianguis == 0 || this.nombreTianguis == '') {
      this.presentToast(`No ha seleccionado ningún tianguis`, 'warning', 2500);
    }
    else {
      this.activateTianguis = false;
      const loading = await this.loadingCtrl.create({
        message: 'Cargando',
        duration: 1500,
        cssClass: 'loader-css-class',
        backdropDismiss: false
      });
      await loading.present();
      this.activateLugares = true;
    }
  }

  async seleccionarLugar(){
    if (this.selected_idLugar == 0 || this.nombreLugar == '' || this.metros == 0) {
      this.presentToast(`No ha seleccionado ningún lugar para asignar`, 'warning', 2500);
    }
    else {
      this.modalInfo(this.datos);
    }
  }

  /* Modal para asignar usuario */
  async modalInfo(data: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
    });
    await loading.present();
    let datos = data;
    console.log(datos);
    const modal = await this.modalCtrl.create({
      component: RegistroAsignacionPage,
      componentProps: { datos: datos },
    });
    loading.dismiss();
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
    });
    return await modal.present();
  }

  async backTianguis(){
    this.activateLugares = false;
    const loading = await this.loadingCtrl.create({
      message: 'Cargando',
      duration: 1500,
      cssClass: 'loader-css-class',
      backdropDismiss: false
    });
    await loading.present();
    this.activateTianguis = true;
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
















  // Borrar Registro
  async deleteAsignacion(numero, slidingItem) {
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: `¿Esta seguro que desea eliminar este registro "${numero}"?`,
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
        slidingItem.close();
        return;
      }
      else if (select == true) {
        slidingItem.close();
        return;
      }
    });
  }

  async registrarAsignacion() {
    let modal = await this.modalCtrl.create({
      component: RegistroAsignacionPage
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
    });
    return await modal.present();
  }
}
