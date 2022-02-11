import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.sass']
})
export class AdminLoginPageComponent implements OnInit {

  form: FormGroup
  loggingIn = false


  constructor(
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      emailAdm: new FormControl("", [
        Validators.required,
      ]),
      passwordAdm: new FormControl("", [
        Validators.required,
      ])
    })
  }

  adminLogIn() {
    this.loggingIn = true
    const user = {
      email: this.form.value.emailAdm.trim(),
      password: this.form.value.passwordAdm.trim(),
    }

    this.firebase.setPersistence()
      .then(() => {
        this.firebase.signInWithPass(user)
        .then((userCredentials: any) => { //успешный вход в юзера
          console.log("userCredentials: ", userCredentials)
          // this.firebase.setUid(userCredentials)
          localStorage.setItem("user-Id",  userCredentials.user.uid)
          console.log("user-Id",  userCredentials.user.uid)
          this.form.reset()
          this.loggingIn = false
          this.router.navigate(['/admin/main'])
          // this.currentUser = userCredentials.user
        })
        .catch((err) => {
          console.log("signInWithEmailAndPassword ERROR: ", err)
          this.loggingIn = false
        })
      })
      .catch((err) => {
        console.log("setPersistence ERROR: ", err)
        this.loggingIn = false
      })
    
    
    
    
    
      // .then((result) => {
      //   console.log("firebase.signInWithPass: ", result);
      //   // this.loggingIn = false
      // })
      // .catch((err) => {
      //   // this.loggingIn = false
      //   console.log("ошибка входа чз firebase: ", err);
      // })

      // this.authServise.login(user).subscribe((response) => {
      //   this.form.reset()
      //   this.loggingIn = false
      //   console.log("authServise.login: ",response)
      //   this.isAdminCheck(response)
      //   this.router.navigate(['/admin'])
  
      // },
      // (err)=> {
      //   console.log("ERROR:", err);
      //   // this.loginErrorHandler(err)
      //   this.loggingIn = false
        
      // })
  }

  isAdminCheck(response) {


  }

  
  


}
