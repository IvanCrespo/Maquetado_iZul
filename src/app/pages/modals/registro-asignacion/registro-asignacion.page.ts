import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController, LoadingController, ToastController } from '@ionic/angular';

// Modals
import { AsignarGiroPage } from '../../modals/asignar-giro/asignar-giro.page';

@Component({
  selector: 'app-registro-asignacion',
  templateUrl: './registro-asignacion.page.html',
  styleUrls: ['./registro-asignacion.page.scss'],
})
export class RegistroAsignacionPage implements OnInit {

  public datos: number = this.navParams.get('datos');

  /* Checked */
  isChecked: boolean = false;
  isCheckedINSEN: boolean = false;

  // Formulario
  s_nombre: string = '';
  s_paterno: string = '';
  s_materno: string = '';
  s_telefono: number = 0;
  s_giro: [] = [];

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    console.log(this.datos);
  }

  /* Checked */
  async onChangeCheckSalida(evento: Event) {
    if (evento) {
      this.isChecked == true;
    }
    else {
      this.isChecked == false;
    }
  }

  async onChangeCheckSalidaINSEN(evento: Event){
    if (evento) {
      this.isCheckedINSEN == true;
    }
    else {
      this.isCheckedINSEN == false;
    }
  }

  guardarInfo(){
    if (this.s_nombre == '' || this.s_paterno == '' || this.s_materno == '' || this.s_telefono == 0 || this.s_giro.length == 0) {
      this.presentToast(`Faltan campos requeridos por llenar.`, 'warning', 2500);
    }
    else {

    }
  }

  async seleccionarGiros(){
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
    });
    await loading.present();
    const modal = await this.modalCtrl.create({
      component: AsignarGiroPage
    });
    loading.dismiss();
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
    });
    return await modal.present();
  }

  async customLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando',
      duration: 1500,
      cssClass: 'loader-css-class',
      backdropDismiss: false
    });
    await loading.present();
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