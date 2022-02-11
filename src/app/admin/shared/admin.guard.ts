import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  userId = localStorage.getItem("user-Id")

  constructor(
    private auth: AuthService,
    private firebase: FirebaseService,
    private popupService: PopupService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) {
      const user = this.firebase.getUser()
      console.log(user)
      const userId = localStorage.getItem("user-Id")
      if (userId && userId === environment.adminId) {
        return true
     } else {
        this.firebase.signOut()
        // this.auth.logout()
        // this.popupService.toggleLoginPopup()
        // this.router.navigate(["/"], {
        //    queryParams: {
        //       needLogin: true
        //    }
        // })
     }
  }
  
}
