import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home-wallet',
        loadChildren: () => import('../../pages/home-wallet/home-wallet.module').then( m => m.HomeWalletPageModule)
      },
      {
        path: 'acerca-de',
        loadChildren: () => import('../../pages/acerca-de/acerca-de.module').then( m => m.AcercaDePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home-wallet',
        pathMatch: 'full'
      },
      {
        path: 'qr-wallet',
        loadChildren: () => import('../../pages/qr-wallet/qr-wallet.module').then( m => m.QrWalletPageModule)
      },
      {
        path: 'asignacion-lugares',
        loadChildren: () => import('../../pages/asignacion-lugares/asignacion-lugares.module').then( m => m.AsignacionLugaresPageModule)
      }
    ]
  },
  {
    path: 'accion-wallet',
    loadChildren: () => import('../../modals/accion-wallet/accion-wallet.module').then( m => m.AccionWalletPageModule)
  },
  {
    path: 'view-wallet',
    loadChildren: () => import('../../modals/view-wallet/view-wallet.module').then( m => m.ViewWalletPageModule)
  },
  {
    path: 'asignar-giro',
    loadChildren: () => import('../../modals/asignar-giro/asignar-giro.module').then( m => m.AsignarGiroPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
