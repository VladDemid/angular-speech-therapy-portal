import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-spec-data',
  templateUrl: './edit-spec-data.component.html',
  styleUrls: ['./edit-spec-data.component.sass']
})
export class EditSpecDataComponent implements OnInit {

  activeAction = "changeOneSpec" //= null когдв будет много опций
  
  constructor() { }

  ngOnInit(): void {
  }

  changeAction(action) {
    this.activeAction = action
  }

}
