import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, FbAuthResponce } from '../interfaces';
import { environment } from 'src/environments/environment';
import { pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DevelopHelp } from './develop-help.service';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
   constructor(
      private http: HttpClient,
      private helper: DevelopHelp,
      private router: Router
      ) { }
   
   get token() {
      const fbTokenExp = localStorage.getItem('fb-token-exp')
      const expDate = new Date(fbTokenExp)
      // console.log(new Date(), expDate)
      // console.log(localStorage.getItem('fb-token-exp'), expDate, "!!!!!")
      if (!!fbTokenExp && new Date() > expDate) {
         this.logout()
         return null
      }
      return localStorage.getItem('token-Id')
   }

   login(user: User) {
      console.log("вход пользователя: " + user.email)
      user.returnSecureToken = true
      return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
         .pipe(
            tap(this.setToken.bind(this))
         )
   }

   logout() { //устаревшее (не использовать)
      localStorage.clear()
      this.router.navigate(['/'])
      console.log("logout🛑 (token expired / no token / exit)");
   }

   toHomePage() {
      this.router.navigate(['/'])
   }

   isAuthenticated(): boolean {
      return !!this.token
   }

   isAuthToConsole() {
      console.log(localStorage.getItem("user-Id"))
      const currentAuth = this.isAuthenticated()
      if (currentAuth) {
         console.log("ok");
      } else {
         console.log("no auth");
         
      }
      
   }

   private setToken(response: FbAuthResponce | null) {
      if (response) {
         const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
         localStorage.setItem("fb-token-exp", expDate.toString())
         
         localStorage.setItem("token-Id",  response.idToken)
         localStorage.setItem("user-Id",  response.localId)
         this.helper.toConsole("authorization completed")
         
      } else {
         localStorage.clear()
      }
   }

   private setId(uid) {
      localStorage.setItem("user-Id", uid)
      console.log("authorization completed")
   }

}