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
    const user = {
      email: this.form.value.emailAdm,
      password: this.form.value.passwordAdm,
    }
    this.loggingIn = true

    this.firebase.signInWithPass(user)
      .then((result) => {
        console.log("firebase.signInWithPass: ", result);
        // this.loggingIn = false
      })
      .catch((err) => {
        // this.loggingIn = false
        console.log("ошибка входа чз firebase: ", err);
      })

      this.authServise.login(user).subscribe((response) => {
        this.form.reset()
        this.loggingIn = false
        console.log("authServise.login: ",response)
        this.isAdminCheck(response)
        this.router.navigate(['/admin'])
  
      },
      (err)=> {
        console.log("ERROR:", err);
        // this.loginErrorHandler(err)
        this.loggingIn = false
        
      })
  }

  isAdminCheck(response) {


  }

  
  


}
