import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccionWalletPageRoutingModule } from './accion-wallet-routing.module';
import { AccionWalletPage } from './accion-wallet.page';

/* Componentes */
import { PagesModule } from 'src/app/components/pages/pages.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccionWalletPageRoutingModule,
    PagesModule
  ],
  declarations: [AccionWalletPage]
})
export class AccionWalletPageModule {}
