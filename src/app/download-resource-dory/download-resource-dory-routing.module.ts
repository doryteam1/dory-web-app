import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoryDesktopComponent } from './components/dory-desktop/dory-desktop.component';
import { DoryMovilComponent } from './components/dory-movil/dory-movil.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'desktop',
    pathMatch: 'full',
  },
  { path: 'desktop', component: DoryDesktopComponent },
  { path: 'movil', component: DoryMovilComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadResourceDoryRoutingModule { }
