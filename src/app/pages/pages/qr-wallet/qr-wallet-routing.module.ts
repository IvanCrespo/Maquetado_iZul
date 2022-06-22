import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrWalletPage } from './qr-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: QrWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrWalletPageRoutingModule {}
