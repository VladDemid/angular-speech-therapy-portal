import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserDoctor } from '../shared/interfaces';
import { CrypterService } from '../shared/services/crypter.service';
import { UserData } from 'src/app/profile/shared/services/user-data.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { DevelopHelp } from '../shared/services/develop-help.service';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-specialist-page',
  templateUrl: './specialist-page.component.html',
  styleUrls: ['./specialist-page.component.sass']
})
export class SpecialistPageComponent implements OnInit {

  defaultAvatarUrl = "https://firebasestorage.googleapis.com/v0/b/inclusive-test.appspot.com/o/users%2Fdefault%2Fdefault-user-avatar.png?alt=media&token=5ae4b7c5-c579-4050-910d-942bbb3c7bba"
  doctorInfo: UserDoctor
  doctorId: string
  isInProfileModule = "false" //может быть строкой т.к. params возвращает строку

  constructor(
    private firebase: FirebaseService,
    private route: ActivatedRoute,
    private crypter: CrypterService,
    public helper: DevelopHelp,
    public userData: UserData
  ) { }

  ngOnInit(): void {
    this.getDoctor() //скачивает данные доктора
    this.checkUserData() //проверяет данные пользователя (клиента), если F5
  }

  getDoctor() {
    this.route.queryParams
    .subscribe((params) => {
      this.isInProfileModule = params.returnToProfileModule //откуда пользователь попал на стр. доктора из профиля/из главной стр.
      this.doctorId = this.crypter.decrypt(params.id) //запись id доктора для инжектирования (ауф) в календарь
      this.firebase.getDoctorInfo(this.crypter.decrypt(params.id))
      .subscribe((doctorInfo: UserDoctor) => {
        this.doctorInfo = doctorInfo
        console.log(doctorInfo);
        console.log("данные доктора загружены");
      })
    })
  }


  checkUserData() { //скачивает данные пользователя если F5
    if (this.isInProfileModule == "true" && !this.userData.myData?.name) {
      this.userData.initialization()
    }
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
