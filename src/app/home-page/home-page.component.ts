import { Component, Inject, OnInit } from '@angular/core';
import { PopupService } from '../shared/services/popup.service';
import { FirebaseService } from '../shared/services/firebase.service';

import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ActivatedRoute, Params } from '@angular/router';
import { DevelopHelp } from '../shared/services/develop-help.service';
// import { ZoomService } from '../shared/services/zoom.service';
// import { zoomConfig } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import Swiper, { Navigation, Pagination, SwiperOptions} from 'swiper';
import { environment, firebaseFunctions } from 'src/environments/environment';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {
  
  doctors = []
  testIndex = 0

  config: SwiperOptions = {
    spaceBetween: 150,
    slidesPerView: "auto",
    initialSlide: 0,
    autoplay: {
      delay: 1000,
      pauseOnMouseEnter: true
    },
    loop: true,
    pagination: { 
      type: 'bullets',
      clickable: true,
     },
    navigation: true,
  }

  

  activeSlide = 0
  promoSlides = [
    {
      src: "/assets/img/home-slider-0.jpg",
      sign: "Дистанционное решение проблем детского развития"
    },
    {
      src: "/assets/img/home-slider-1.jpg",
      sign: "Думаете, онлайн занятия - скучно и не продуктивно?"
    },
    {
      src: "/assets/img/home-slider-2.jpg",
      sign: "Мы ценим юмор и креатив"
    },
    {
      src: "/assets/img/home-slider-3.jpg",
      sign: "И поэтому видим радость в глазах наших учеников"
    },
  ]

  testUrls = ['https://image.shutterstock.com/image-vector/img-file-document-icon-260nw-1356823577.jpg','https://image.shutterstock.com/image-vector/img-file-document-icon-260nw-1363854290.jpg']
  
  constructor(
    public popupService: PopupService,
    private firebase: FirebaseService,
    private activatedRoute: ActivatedRoute,
    public helper: DevelopHelp,
    private http: HttpClient
    
    ) { 
      
    }

  ngOnInit(): void {
    this.getAllDoctors()
    this.checkQuerry()
    Swiper.use([Navigation, Pagination])
  }

  initSwiper() {

  }

  onSwiper(swiper) {
    console.log(swiper)
  }

  onSlideChange() {
    // console.log("change")
  }

  FBtest() {
    this.firebase.testFunctionRandom()
    .then((res) => {
      console.log("ура блять: ", res)
    })
    .catch((err) => {
      console.log("Ошибка FBtest: ", err)
    })
    
  }


  checkQuerry() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params["mode"] ) {
        // this.firebase.applyActionCode(params["oobCode"])
        // console.log(`dectected: ${params["mode"]} mode`);
        // this.applyFirebaseCodes(params["mode"], params["oobCode"], params["apiKey"])
        this.popupService.toggleFbSecurityPopup()
      } 
    })
  }

  

  // testSignIn() {
  //   const user = {
  //     email: "test5@mail.ru",
  //     password: "123456"}
  //   this.firebase.signInWithPass(user)
  // }

  getAllDoctors() {
    this.firebase.getDoctorsInfo()
    .subscribe((resp) => {
      // console.log("все пользователи: ", resp);
      this.sortDoctors(resp)
    },
    (err) => {
      console.log("ошибка при получении докторов ", err);
    }) 
  }

  sortDoctors(users) {
    // let doctors = []
    for (const property in users) {
      // console.log("проверка пользователя:" ,users[property]);
      if (users[property].userType == "doctor") {
        users[property].id = property;
        this.doctors.push(users[property])
      }
    }
    console.log("доктора: ", this.doctors);
  }


  
}
