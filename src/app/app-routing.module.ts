import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutBlankComponent } from './layout/layout-blank/layout-blank.component';
import { MlayoutComponent } from './layout/mlayout/mlayout.component';
import { Error404Component } from './error/error404/error404.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LayoutBlankComponent, loadChildren: () => import('./authorization/authorization.module').then(m => m.AuthorizationModule)},
  {path: 'home', component: MlayoutComponent, loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: 'acc', component: MlayoutComponent, loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  {path: 'user', component: MlayoutComponent, loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
