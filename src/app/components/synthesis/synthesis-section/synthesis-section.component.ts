import {Component, Input, OnInit} from '@angular/core';
import {SynthesisCard} from '../../../models/synthesis-card.model';

@Component({
  selector: 'app-report-section',
  templateUrl: './synthesis-section.component.html',
  styleUrls: ['./synthesis-section.component.css']
})
export class SynthesisSectionComponent implements OnInit {
  @Input() cards: SynthesisCard[] = [];
  @Input() title: string;
  @Input() subtitle: string;
  constructor() { }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }
}
