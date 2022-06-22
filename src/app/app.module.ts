import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabsPageModule } from './pages/menu/tabs/tabs.module';

/* Componentes */
import { PagesModule } from './components/pages/pages.module';

//Plugins
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx'; 
import { StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    PagesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TabsPageModule,
    Ng2SearchPipeModule
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy
  }, BarcodeScanner, BluetoothSerial, StarPRNT, Geolocation, Network],
  bootstrap: [AppComponent],
})
export class AppModule { }
