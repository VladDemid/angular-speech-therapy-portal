import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserDoctor } from '../../interfaces';
import { CrypterService } from '../../services/crypter.service';
import { UserData } from 'src/app/profile/shared/services/user-data.service';

@Component({
  selector: 'app-specialist-page',
  templateUrl: './specialist-page.component.html',
  styleUrls: ['./specialist-page.component.sass']
})
export class SpecialistPageComponent implements OnInit {

  defaultAvatarUrl = "https://firebasestorage.googleapis.com/v0/b/inclusive-test.appspot.com/o/users%2Fdefault%2Fdefault-user-avatar.png?alt=media&token=5ae4b7c5-c579-4050-910d-942bbb3c7bba"
  doctorInfo: UserDoctor
  doctorId: string
  isInProfileModule = false

  constructor(
    private firebase: FirebaseService,
    private route: ActivatedRoute,
    private crypter: CrypterService,
    // private userData: UserData
  ) { }

  ngOnInit(): void {
    this.getDoctor()
  }

  getDoctor() {
    
    this.route.queryParams
    .subscribe((params) => {
      this.isInProfileModule = params.returnToProfileModule
      this.doctorId = this.crypter.decrypt(params.id) //запись id доктора для инжектирования (ауф) в календарь
      // console.log("дешифрованный id: ", this.crypter.decrypt(params.id2));
      this.firebase.getDoctorInfo(this.crypter.decrypt(params.id))
      .subscribe((doctorInfo: UserDoctor) => {
        this.doctorInfo = doctorInfo
        console.log(doctorInfo);
      })
    })
  }

  decryptId() {

  }

  cryptDoctorId() {
    this.route.queryParams
    .subscribe((params) => {
      console.log(this.crypter.encrypt(""+params.id));
      console.log(this.crypter.decrypt("U2FsdGVkX1+HUjkmIk7PKmElj+3TsKZAURD2gSitKXrM3f6Hobs0/dUguZij+sNo"));
      
    })
  }

}
