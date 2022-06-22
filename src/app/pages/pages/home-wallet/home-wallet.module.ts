import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomeWalletPageRoutingModule } from './home-wallet-routing.module';
import { HomeWalletPage } from './home-wallet.page';

/* Componentes */
import { PagesModule } from 'src/app/components/pages/pages.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeWalletPageRoutingModule,
    PagesModule
  ],
  declarations: [HomeWalletPage]
})
export class HomeWalletPageModule {}
