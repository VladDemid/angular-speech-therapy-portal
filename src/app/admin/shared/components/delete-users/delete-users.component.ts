import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import firebase from 'firebase';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

@Component({
  selector: 'app-delete-users',
  templateUrl: './delete-users.component.html',
  styleUrls: ['./delete-users.component.sass']
})
export class DeleteUsersComponent implements OnInit {

  adminDeleteUserForm = new FormGroup({
    email: new FormControl('')
  })

  constructor(
    private firebase: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const userEmail = this.adminDeleteUserForm.value.email
    console.log(userEmail)
    this.firebase.findUserByEmail(userEmail)
      .then((resp) => {
        console.log("resp: ", resp)
      })
      .catch((err) => {
        console.log("get user err: ", err)
      })
  }

}
