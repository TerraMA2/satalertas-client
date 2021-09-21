import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';

import localePt from '@angular/common/locales/pt';
import { AppRoutingModule } from './app-routing.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { DragDropModule } from 'primeng/dragdrop';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageService, TreeDragDropService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToolbarModule } from 'primeng/toolbar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TreeTableModule } from 'primeng/treetable';
import { PickListModule } from 'primeng/picklist';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ScrollTopModule } from 'primeng/scrolltop';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SpeedDialModule } from 'primeng/speeddial';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './map/table/table.component';
import { SynthesisComponent } from './synthesis/synthesis.component';
import { FilterComponent } from './filter/filter.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LegendComponent } from './map/legend/legend.component';
import { SynthesisLegendComponent } from './synthesis/synthesis-legend/synthesis-legend.component';
import { SynthesisPropertyDataComponent } from './synthesis/synthesis-property-data/synthesis-property-data.component';
import { AuthComponent } from './auth/auth.component';
import { AboutComponent } from './about/about.component';
import { SidebarHeaderComponent } from './sidebar/sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarLayerGroupComponent } from './sidebar/sidebar-menu/sidebar-layer-group/sidebar-layer-group.component';
import { SidebarItemComponent } from './sidebar/sidebar-menu/sidebar-item/sidebar-item.component';
import { SidebarFooterComponent } from './sidebar/sidebar-footer/sidebar-footer.component';
import { SidebarLayerComponent } from './sidebar/sidebar-menu/sidebar-layer-group/sidebar-layer/sidebar-layer.component';
import { VisibleLayersComponent } from './map/visible-layers/visible-layers.component';
import { PopupComponent } from './map/popup/popup.component';
import { CardAreaComponent } from './dashboard/card-area/card-area.component';
import { CardButtonComponent } from './dashboard/card-area/card-button/card-button.component';
import { ThemeComponent } from './filter/theme/theme.component';
import { AlertTypeComponent } from './filter/alert-type/alert-type.component';
import { AuthorizationComponent } from './filter/authorization/authorization.component';
import { SpecificSearchComponent } from './filter/specific-search/specific-search.component';
import { FooterFilterComponent } from './filter/footer-filter/footer-filter.component';
import { ReportComponent } from './reports/report/report.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { ClassComponent } from './filter/class/class.component';
import { ListboxModule } from 'primeng/listbox';
import { LayerToolsComponent } from './map/layer-tools/layer-tools.component';
import { SliderModule } from 'primeng/slider';
import { SettingsComponent } from './settings/settings.component';
import { GroupManagerComponent } from './settings/group-manager/group-manager.component';
import { GroupListComponent } from './settings/group-manager/group-list/group-list.component';
import { ModalComponent } from './modal.component/modal.component';
import { LayersComponent } from './settings/layers/layers.component';
import { SettingsToolbarComponent } from './settings/settings-toolbar/settings-toolbar.component';
import { LayersAdvancedComponent } from './settings/layers-advanced/layers-advanced.component';
import { LayersAdvancedEditionComponent } from './settings/layers-advanced/layers-advanced-edition/layers-advanced-edition.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../environments/environment';
import { SynthesisCardComponent } from './synthesis/synthesis-section/synthesis-card/synthesis-card.component';
import { SynthesisChartComponent } from './synthesis/synthesis-chart/synthesis-chart.component';
import { SynthesisSectionComponent } from './synthesis/synthesis-section/synthesis-section.component';
import { SynthesisChartCardComponent } from './synthesis/synthesis-chart/synthesis-chart-card/synthesis-chart-card.component';
import { SynthesisNdviComponent } from './synthesis/synthesis-ndvi/synthesis-ndvi.component';
import { ReportListComponent } from './reports/report-list/report-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReportsComponent } from './reports/reports.component';
import { AuthGuard } from './auth/auth.guard';
import { ChartsAreaComponent } from './dashboard/charts-area/charts-area.component';
import { StyleClassModule } from 'primeng/styleclass';
import { InfoColumnsComponent } from './settings/info-columns/info-columns.component';
import { SubLayerTableComponent } from './settings/layers-advanced/layer-table/sub-layer-table/sub-layer-table.component';
import { LayerTableComponent } from './settings/layers-advanced/layer-table/layer-table.component';
import { HttpInterceptorService } from '../services/http-interceptor.service';
import { SearchComponent } from './map/search/search.component';

registerLocaleData(localePt, 'pt');

const project = environment.project;

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, `./assets/config/${project ? project + '/' : ''}i18n/`, '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		SidebarComponent,
		MapComponent,
		DashboardComponent,
		TableComponent,
		SynthesisComponent,
		FilterComponent,
		HeaderComponent,
		LegendComponent,
		SynthesisPropertyDataComponent,
		SynthesisLegendComponent,
		AuthComponent,
		AboutComponent,
		SidebarHeaderComponent,
		SidebarFooterComponent,
		SidebarMenuComponent,
		SidebarLayerGroupComponent,
		SidebarLayerComponent,
		VisibleLayersComponent,
		PopupComponent,
		ChartsAreaComponent,
		CardAreaComponent,
		CardButtonComponent,
		ThemeComponent,
		AlertTypeComponent,
		AuthorizationComponent,
		SpecificSearchComponent,
		FooterFilterComponent,
		SidebarItemComponent,
		ReportComponent,
		ClassComponent,
		LayerToolsComponent,
		SettingsComponent,
		GroupManagerComponent,
		GroupListComponent,
		ModalComponent,
		LayersComponent,
		SettingsToolbarComponent,
		LayersAdvancedComponent,
		LayersAdvancedEditionComponent,
		SynthesisCardComponent,
		SynthesisChartComponent,
		SynthesisSectionComponent,
		SynthesisChartCardComponent,
		SynthesisNdviComponent,
		ReportsComponent,
		ReportListComponent,
		PageNotFoundComponent,
		InfoColumnsComponent,
		SubLayerTableComponent,
		LayerTableComponent,
  SearchComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CardModule,
		ChartModule,
		ScrollPanelModule,
		TableModule,
		DragDropModule,
		SidebarModule,
		MultiSelectModule,
		InputTextModule,
		FormsModule,
		PasswordModule,
		ButtonModule,
		TooltipModule,
		DropdownModule,
		DialogModule,
		CalendarModule,
		AccordionModule,
		KeyFilterModule,
		InputSwitchModule,
		CheckboxModule,
		ToastModule,
		RadioButtonModule,
		ToolbarModule,
		NgxExtendedPdfViewerModule,
		ProgressSpinnerModule,
		InputTextareaModule,
		ConfirmDialogModule,
		MessagesModule,
		ListboxModule,
		SliderModule,
		TreeTableModule,
		PickListModule,
		RippleModule,
		MessageModule,
		ScrollTopModule,
		OverlayPanelModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		StyleClassModule,
		SpeedDialModule
	],
	providers: [
		TreeDragDropService,
		Title,
		MessageService,
		AuthGuard,
		{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
	],
	bootstrap: [AppComponent],
})
export class AppModule {
}
