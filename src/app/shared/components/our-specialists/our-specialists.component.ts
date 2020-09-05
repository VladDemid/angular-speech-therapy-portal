import { Component, OnInit, Input } from '@angular/core';
import { UserDbInfo } from '../../interfaces';

@Component({
  selector: 'app-our-specialists',
  templateUrl: './our-specialists.component.html',
  styleUrls: ['./our-specialists.component.sass']
})
export class OurSpecialistsComponent implements OnInit {
  @Input() firebaseDoctors: UserDbInfo[]
  @Input() isProfileModule: boolean

  activeSpecialists: string = ""


  constructor() { }

  ngOnInit(): void {
  }

  onSpecializationChange(selector) {
    this.activeSpecialists = selector.value
  }

}
