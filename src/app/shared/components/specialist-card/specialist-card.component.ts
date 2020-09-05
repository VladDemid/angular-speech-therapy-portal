import { Component, OnInit, Input } from '@angular/core';
import { UserDbInfo } from '../../interfaces';
import { CrypterService } from '../../services/crypter.service';

@Component({
  selector: 'app-specialist-card',
  templateUrl: './specialist-card.component.html',
  styleUrls: ['./specialist-card.component.sass']
})
export class SpecialistCardComponent implements OnInit {

  @Input() card: UserDbInfo
  @Input() isProfileModule: boolean
  active = false
  defaultAvatarUrl="https://firebasestorage.googleapis.com/v0/b/inclusive-test.appspot.com/o/users%2Fdefault%2Fdefault-user-avatar.png?alt=media&token=5ae4b7c5-c579-4050-910d-942bbb3c7bba"
  encryptedId: string

  constructor(private crypter: CrypterService) { }

  ngOnInit(): void {
    // if (!this.card.img) {
    //   this.card.img = "assets/img/catalog/profile_normal.jpg"
    // }
    this.encryptedId = this.crypter.encrypt(this.card.id)
  }

  showSchedule(cardEl, linkEl) {
    // linkEl.preventDefault()
    this.active = !this.active
    return false
  }

}
