import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccionWalletPage } from './accion-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: AccionWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccionWalletPageRoutingModule {}
