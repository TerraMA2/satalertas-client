import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { MapComponent } from './map/map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SynthesisComponent } from './synthesis/synthesis.component';
import { ReportComponent } from './reports/report/report.component';
import { SettingsComponent } from './settings/settings.component';
import { LayersComponent } from './settings/layers/layers.component';
import { LayersAdvancedComponent } from './settings/layers-advanced/layers-advanced.component';
import { ReportsComponent } from './reports/reports.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GroupManagerComponent } from './settings/group-manager/group-manager.component';
import { ReportListComponent } from './reports/report-list/report-list.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
	{ path: '', component: DashboardComponent },
	{ path: 'map', component: MapComponent },
	{ path: 'synthesis/:carRegister', component: SynthesisComponent },
	{
		path: 'reports', canActivateChild: [AuthGuard], resolve: {user: AuthGuard}, component: ReportsComponent,
		children: [
			{ path: '', component: ReportListComponent },
			{ path: ':type/:carRegister', resolve: {user: AuthGuard}, component: ReportComponent },
		]
	},
	{
		path: 'settings', canActivateChild: [AuthGuard], resolve: {user: AuthGuard}, component: SettingsComponent,
		children: [
			{ path: '', redirectTo: 'groups', pathMatch: 'full' },
			{ path: 'groups', component: GroupManagerComponent },
			{ path: 'layers', component: LayersComponent },
			{ path: 'layers-advanced', component: LayersAdvancedComponent }
		]
	},
	{ path: '**', component: PageNotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
