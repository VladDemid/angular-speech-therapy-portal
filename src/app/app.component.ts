import { Component } from '@angular/core';
import { DevelopHelp } from './shared/services/develop-help.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'inclusive2';
  
  constructor(
    private helper: DevelopHelp
    ) { }
    
    ngOnInit() {
      this.helper.preventLog()
  }
}
