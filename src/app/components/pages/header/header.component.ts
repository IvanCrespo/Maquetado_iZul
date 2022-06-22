import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

/* Servicios */
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  /* @Input() titulo: string = 'Bienvenido'; */
  /* User Data */
  user: any;

  /* Timer */
  timer: any;
  timerSalida: any;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.user = localStorage.getItem('user');
  }

  ngOnInit() { }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: `Seguro que quiere cerrar sesión?"`,
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
      message: 'Espere un momento...',
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
          self.authService.logout();
          self.router.navigateByUrl('/', { replaceUrl: true });
        }, 700);
      }
    });
    loading.dismiss();
  }
  /* async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  } */
}
