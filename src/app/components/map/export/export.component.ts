import {Component, Input, OnInit} from '@angular/core';
import {Layer} from '../../../models/layer.model';
import {ConfigService} from '../../../services/config.service';
import {HTTPService} from '../../../services/http.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  formats: [];
  selectedFormats: [];

  @Input() displayExport = false;

  @Input() exportLayer: Layer;

  constructor(
      private configService: ConfigService,
      private httpService: HTTPService
  ) { }

  ngOnInit() {
    this.formats = this.configService.getMapConfig('export').formats;
  }

  onExportClick() {
    this.httpService.get('/export', this.selectedFormats).subscribe(() => {

    });
  }

}
