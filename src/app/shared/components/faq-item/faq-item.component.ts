import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TabContent } from '../../interfaces';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.component.html',
  styleUrls: ['./faq-item.component.sass']
})
export class FaqItemComponent implements OnInit {

  @Input() tabItem: TabContent
  @Input() tabIndex: number
  @Input() currentFaq: number
  @Output() newTabIndex = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  onClick() {
    console.log("внутри дочернего компонента",this.tabIndex);
    this.newTabIndex.emit(this.tabIndex)
  }

}
