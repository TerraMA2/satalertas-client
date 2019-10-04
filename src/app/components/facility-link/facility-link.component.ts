import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facility-link',
  templateUrl: './facility-link.component.html',
  styleUrls: ['./facility-link.component.css']
})
export class FacilityLinkComponent implements OnInit {
  public link: string;

  public title: string;

  constructor() { }

  ngOnInit() {
  }

}
