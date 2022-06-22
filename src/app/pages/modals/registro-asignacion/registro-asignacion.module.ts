import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroAsignacionPageRoutingModule } from './registro-asignacion-routing.module';

import { RegistroAsignacionPage } from './registro-asignacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroAsignacionPageRoutingModule
  ],
  declarations: [RegistroAsignacionPage]
})
export class RegistroAsignacionPageModule {}
