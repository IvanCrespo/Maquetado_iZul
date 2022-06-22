import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/* Guards */
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/menu/tabs/tabs.module').then( m => m.TabsPageModule),
    canLoad: [AuthGuard] // Asegura todas las páginas secundarias
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard] // Comprobar si debemos mostrar el login o mandarlo a home
  },
  {
    path: 'tianguis-wallet',
    loadChildren: () => import('./pages/pages/tianguis-wallet/tianguis-wallet.module').then( m => m.TianguisWalletPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'registro-asignacion',
    loadChildren: () => import('./pages/modals/registro-asignacion/registro-asignacion.module').then( m => m.RegistroAsignacionPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
