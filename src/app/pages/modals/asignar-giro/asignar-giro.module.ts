import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignarGiroPageRoutingModule } from './asignar-giro-routing.module';

import { AsignarGiroPage } from './asignar-giro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignarGiroPageRoutingModule
  ],
  declarations: [AsignarGiroPage]
})
export class AsignarGiroPageModule {}
