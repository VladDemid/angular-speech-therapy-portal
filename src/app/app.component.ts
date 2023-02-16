import { Component } from '@angular/core';
import { CookieService } from './shared/services/cookie.service';
import { DevelopHelp } from './shared/services/develop-help.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'inclusive2';
  
  constructor(
    private helper: DevelopHelp,
    public cookieService: CookieService,
  ) {
  }
    
    ngOnInit() {
      // this.helper.preventLog()
  }
}
