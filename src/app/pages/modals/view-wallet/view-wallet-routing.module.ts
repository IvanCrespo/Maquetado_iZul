import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewWalletPage } from './view-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: ViewWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewWalletPageRoutingModule {}
