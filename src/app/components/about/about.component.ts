import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  @Input() displayAbout;

  @Output() closeAboutClicked = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  closeAbout() {
    this.closeAboutClicked.emit(false);
  }

}
