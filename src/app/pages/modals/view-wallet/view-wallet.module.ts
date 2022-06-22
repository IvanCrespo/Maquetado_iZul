import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWalletPageRoutingModule } from './view-wallet-routing.module';
import { ViewWalletPage } from './view-wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewWalletPageRoutingModule
  ],
  declarations: [ViewWalletPage]
})
export class ViewWalletPageModule {}
