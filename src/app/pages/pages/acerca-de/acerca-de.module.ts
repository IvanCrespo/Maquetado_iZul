import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AcercaDePageRoutingModule } from './acerca-de-routing.module';
import { AcercaDePage } from './acerca-de.page';

/* Componentes */
import { PagesModule } from 'src/app/components/pages/pages.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcercaDePageRoutingModule,
    PagesModule
  ],
  declarations: [AcercaDePage]
})
export class AcercaDePageModule {}
