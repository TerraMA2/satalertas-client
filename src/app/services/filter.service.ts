import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Layer} from '../models/layer.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filter = new Subject<Layer>();

  constructor() { }
}
