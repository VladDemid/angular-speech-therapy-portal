import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recomendation',
  templateUrl: './recomendation.component.html',
  styleUrls: ['./recomendation.component.sass']
})
export class RecomendationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tabs = ["Игры", "Видео-уроки", "Советы и статьи"]
  activeTab = "Игры"

  changeActiveTab(item) {
    this.activeTab = item
  }

}
