import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
/* Servicios */
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /* Formulario */
  login: FormGroup;
  type: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.login = this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /* Verificar contraseña oculta */
  ChangeType() {
    this.type = !this.type;
  }

  get errorControl() {
    return this.login.controls;
  }

  async singIn() {
    if (!this.login.valid) {
      return false;
    }
    else {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.authService.login(this.login.value).subscribe(
        async (data) => {
          console.log("Login: ", data);
          if (data != false) {
            localStorage.setItem('user', data.data.s_nombre);
            await loading.dismiss();
            this.presentToast(`Accesos correctos`, 'success', 2500);
            this.router.navigateByUrl('/tianguis-wallet', { replaceUrl: true });
          }
          else {
            await loading.dismiss();
          }
        });
    }
  }

  /* Errores APIS Status */
  isNotErrorApiResponse(response: any): boolean {
    if (response.status == 'empty'){return false;} 
    if (response.status == 'fail'){return false;} 
    if (response.status == 'logout') {
      console.log("Sale");
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
