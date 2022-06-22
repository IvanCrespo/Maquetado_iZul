import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroAsignacionPage } from './registro-asignacion.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroAsignacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroAsignacionPageRoutingModule {}
