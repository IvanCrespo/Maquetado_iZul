import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrWalletPageRoutingModule } from './qr-wallet-routing.module';
import { QrWalletPage } from './qr-wallet.page';

/* Componentes */
import { PagesModule } from 'src/app/components/pages/pages.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrWalletPageRoutingModule,
    PagesModule
  ],
  declarations: [QrWalletPage]
})
export class QrWalletPageModule {}
