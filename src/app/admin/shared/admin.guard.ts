import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  userId = localStorage.getItem("user-Id")

  constructor(
    private auth: AuthService,
    private popupService: PopupService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) {
      
      if (this.auth.isAuthenticated() && this.userId === "XUuNLsPankPqmDKLBb8ZS4X1dq12") {
        return true
     } else {
        this.auth.logout()
        this.popupService.toggleLoginPopup()
        this.router.navigate(["/"], {
           queryParams: {
              needLogin: true
           }
        })
     }
  }
  
}
