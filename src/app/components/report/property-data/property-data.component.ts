import {Component, Input, OnInit} from '@angular/core';
import {Util} from '../../../utils/util';
import {Property} from 'src/app/models/property.model';

@Component({
    selector: 'app-property-data',
    templateUrl: './property-data.component.html',
    styleUrls: ['./property-data.component.css']
})
export class PropertyDataComponent implements OnInit {

    @Input() property: Property;

    constructor() {
    }

    ngOnInit() {

    }

    formatterCpfCnpj(cpfCnpj) {
        if (cpfCnpj) {
            const listCpfCnpj = cpfCnpj.split(',');

            cpfCnpj = '';
            if (listCpfCnpj.length > 0) {
                listCpfCnpj.forEach(value => {
                    if (!cpfCnpj) {
                        cpfCnpj = Util.cpfCnpjMask(value);
                    } else {
                        cpfCnpj += `, ${Util.cpfCnpjMask(value)}`;
                    }
                });
            }
        }

        return cpfCnpj ? cpfCnpj : '';
    }

}
