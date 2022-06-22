import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TianguisWalletPageRoutingModule } from './tianguis-wallet-routing.module';
import { TianguisWalletPage } from './tianguis-wallet.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

/* Componentes */
import { PagesModule } from 'src/app/components/pages/pages.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TianguisWalletPageRoutingModule,
    PagesModule,
    Ng2SearchPipeModule
  ],
  declarations: [TianguisWalletPage]
})
export class TianguisWalletPageModule {}
