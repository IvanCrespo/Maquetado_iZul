import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignacionLugaresPage } from './asignacion-lugares.page';

const routes: Routes = [
  {
    path: '',
    component: AsignacionLugaresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignacionLugaresPageRoutingModule {}
