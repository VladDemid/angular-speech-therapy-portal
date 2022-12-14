import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { PopupService } from '../shared/services/popup.service';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.sass']
})
export class AdminLoginPageComponent implements OnInit {

  loggingIn = false
  requiredErr = false

  
  adminLoginForm = new FormGroup({
    email: new FormControl('jfghj.dfvcfghf@gmail.com'),
    password: new FormControl('xhIe#!l^%kA*')
  })

  get email() {return this.adminLoginForm.get('email')}
  get password() {return this.adminLoginForm.get('password')}

  constructor(
    private authServise: AuthService,
    private firebase: FirebaseService,
    private router: Router,
    public popupService: PopupService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {}

  adminLogIn() {
    this.loggingIn = true
    const user = {
      email: this.adminLoginForm.value.email.trim(),
      password: this.adminLoginForm.value.password.trim(),
    }

    this.firebase.setPersistence()
      .then(() => {
        this.firebase.signInWithPass(user)
        .then((userCredentials: any) => { //успешный вход в юзера
          console.log("userCredentials: ", userCredentials)
          // this.firebase.setUid(userCredentials)
          localStorage.setItem("user-Id",  userCredentials.user.uid)
          console.log("user-Id",  userCredentials.user.uid)
          this.adminLoginForm.reset()
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
