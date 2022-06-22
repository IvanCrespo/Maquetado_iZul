import { Injectable } from '@angular/core';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private online: Observable<boolean> = null;
  private hasConnection = new BehaviorSubject(false);

  constructor(
    private network: Network,
    private platform: Platform
  ) {
    if (this.platform.is('cordova')) {
      // En dispositivos moviles
      this.network.onConnect().subscribe(() => {
        this.hasConnection.next(true);
        return;
      });
      this.network.onDisconnect().subscribe(() => {
        this.hasConnection.next(false);
        return;
      });
    }
    else {
      // En navegador web
      this.online = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );

      this.online.subscribe((isOnline) => {
        if (isOnline) {
          this.hasConnection.next(true);
        } else {
          console.log(isOnline);
          this.hasConnection.next(false);
        }
      });
    }
  }

  public getNetworkType(): string {
    return this.network.type;
  }

  public getNetworkStatus(): Observable<boolean> {
    return this.hasConnection.asObservable();
  }
}
