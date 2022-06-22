import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarGiroPage } from './asignar-giro.page';

const routes: Routes = [
  {
    path: '',
    component: AsignarGiroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignarGiroPageRoutingModule {}
