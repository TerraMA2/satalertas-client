import {GroupManagerComponent} from './settings/group-manager/group-manager.component';
import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {MapComponent} from './map/map.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SynthesisComponent} from './synthesis/synthesis.component';
import {ReportComponent} from './report/report.component';
import {SettingsComponent} from './settings/settings.component';
import {LayersComponent} from './settings/layers/layers.component';
import {LayersAdvancedComponent} from './settings/layers-advanced/layers-advanced.component';

const routes: Routes = [
	{path: '', component: DashboardComponent},
	{path: 'map', component: MapComponent, data: {reuseRoute: true}},
	{path: 'synthesis', component: SynthesisComponent},
	{path: 'synthesis/:carRegister', component: SynthesisComponent},
	{path: 'report/:type/:carRegister', component: ReportComponent},
	{
		path: 'settings', component: SettingsComponent,
		children: [
			{path: '', redirectTo: 'groups', pathMatch: 'full'},
			{path: 'groups', component: GroupManagerComponent},
			{path: 'layers', component: LayersComponent},
			{path: 'layers-advanced', component: LayersAdvancedComponent}
		]
	}
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
