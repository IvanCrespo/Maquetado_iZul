import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CanLoad, Router } from '@angular/router';

/* Servicios */
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthenticationService, private router: Router) { }
 
  canLoad(): Observable<boolean> {    
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filtra el valor de sujeto de comportamiento inicial
      take(1), // De lo contrario el Observable no se completa!
      map(isAuthenticated => {
        if (isAuthenticated) {          
          return true;
        } else {          
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}