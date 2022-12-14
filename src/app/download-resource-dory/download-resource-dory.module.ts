import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DownloadResourceDoryRoutingModule } from './download-resource-dory-routing.module';
import { DoryDesktopComponent } from './components/dory-desktop/dory-desktop.component';
import { DoryMovilComponent } from './components/dory-movil/dory-movil.component';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DoryDesktopComponent,
    DoryMovilComponent,
  ],
  imports: [CommonModule, DownloadResourceDoryRoutingModule, SharedModule],
})
export class DownloadResourceDoryModule {}
