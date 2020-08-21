import { Component, OnInit } from '@angular/core';
import { UserData } from '../../services/user-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.sass']
})
export class ProfileLayoutComponent implements OnInit {


  constructor(
    public userData: UserData,
  ) { }

  ngOnInit(): void {
    this.userData.initialization()
    
  }

}
