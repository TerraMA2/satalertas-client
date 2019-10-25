import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CarService} from '../../../services/car.service';

@Component({
  selector: 'app-analyze-car-grid',
  templateUrl: './analyze-car-grid.component.html',
  styleUrls: ['./analyze-car-grid.component.css']
})
export class AnalyzeCarGridComponent implements OnInit, AfterViewInit {

  cars;
  cols;
  selectedCars: [];

  constructor(
    private carService: CarService
  ) { }

  ngOnInit() {
    this.carService.getAllSimplified().then( result => this.cars = result );

    this.cols = [
          { field: 'mt_car_number', header: 'Número CAR' },
          { field: 'property_name', header: 'Proprietário' },
          { field: 'city_name', header: 'Município' },
          { field: 'property_area', header: 'Área' },
          { field: 'status', header: 'Status' }
        ];

    console.log(this.cols);
  }

  ngAfterViewInit(): void {
    console.log(this.cars);
  }

}
