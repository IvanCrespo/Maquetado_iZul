import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignacionLugaresPageRoutingModule } from './asignacion-lugares-routing.module';

import { AsignacionLugaresPage } from './asignacion-lugares.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignacionLugaresPageRoutingModule
  ],
  declarations: [AsignacionLugaresPage]
})
export class AsignacionLugaresPageModule {}
