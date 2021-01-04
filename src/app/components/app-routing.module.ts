import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {MapComponent} from './map/map.component';

import {DashboardComponent} from './dashboard/dashboard.component';

import {ReportComponent} from './report/report.component';

import {FinalReportComponent} from './final-report/final-report.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'map', component: MapComponent, data: {reuseRoute: true}},
    {path: 'report', component: ReportComponent},
    {path: 'report/:carRegister', component: ReportComponent},
    {path: 'finalReport/:type/:carRegister', component: FinalReportComponent},
    {path: 'settings', component: SettingsComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'ignore',
    relativeLinkResolution: 'legacy'
})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
