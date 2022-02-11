import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProfileGuard implements CanActivate {

   
   constructor(
      private auth: AuthService,
      private popupService: PopupService,
      private router: Router,
      private firebase: FirebaseService
      ) { }
      
   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
      ) {
         //TODO убрать костыль userId !=.....
      const userId = localStorage.getItem("user-Id")
      if (userId) {
         return true
      } else {
         this.firebase.signOut("needLogin")
         this.popupService.toggleLoginPopup()
         // this.auth.logout() //пересмотреть
         // this.router.navigate(["/"], {
         //    queryParams: {
         //       needLogin: true
         //    }
         // })
      }

   }
}