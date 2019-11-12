import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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
import { TreeDragDropService, MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxPrintModule } from 'ngx-print';
import { ToolbarModule } from 'primeng/toolbar';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './map/table/table.component';
import { ReportComponent } from './report/report.component';
import { FilterComponent } from './filter/filter.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LegendComponent } from './map/legend/legend.component';
import { ReportLegendComponent } from './report/report-legend/report-legend.component';
import { PropertyDataComponent } from './report/property-data/property-data.component';
import { VisionComponent } from './report/vision/vision.component';
import { VisionDetailedComponent } from './report/vision-detailed/vision-detailed.component';
import { DeforestationComponent } from './report/deforestation/deforestation.component';
import { DeforestationHistoryComponent } from './report/deforestation-history/deforestation-history.component';
import { BurningSpotlightsComponent } from './report/burning-spotlights/burning-spotlights.component';
import { BurningSpotlightsChartComponent } from './report/burning-spotlights-chart/burning-spotlights-chart.component';
import { BurnedAreasComponent } from './report/burned-areas/burned-areas.component';
import { BurnedAreasChartComponent } from './report/burned-areas-chart/burned-areas-chart.component';
import { ImageHistoryComponent } from './report/image-history/image-history.component';
import { AuthComponent } from './auth/auth.component';
import { AboutComponent } from './about/about.component';
import { SidebarHeaderComponent } from './sidebar/sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarLayerGroupComponent } from './sidebar/sidebar-menu/sidebar-layer/sidebar-layer-group.component';
import { SidebarItemComponent } from './sidebar/sidebar-menu/sidebar-item/sidebar-item.component';
import { SidebarFooterComponent } from './sidebar/sidebar-footer/sidebar-footer.component';
import { SidebarLayerComponent } from './sidebar/sidebar-menu/sidebar-layer/sidebar-layer/sidebar-layer.component';
import { VisibleLayersComponent } from './map/visible-layers/visible-layers.component';
import { PopupLinkComponent } from './map/popup-link/popup-link.component';
import { GraphicsAreaComponent } from './dashboard/graphics-area/graphics-area.component';
import { CardAreaComponent } from './dashboard/card-area/card-area.component';
import { CardButtonComponent } from './dashboard/card-area/card-button/card-button.component';
import { ThemeAreaComponent } from './filter/theme-area/theme-area.component';
import { AlertTypeAreaComponent } from './filter/alert-type-area/alert-type-area.component';
import { AuthorizationAreaComponent } from './filter/authorization-area/authorization-area.component';
import { SpecificSearchAreaComponent } from './filter/specific-search-area/specific-search-area.component';
import { FooterFilterAreaComponent } from './filter/footer-filter-area/footer-filter-area.component';
import { FinalReportComponent } from './final-report/final-report.component';
registerLocaleData(localePt, 'pt');
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MapComponent,
    DashboardComponent,
    TableComponent,
    ReportComponent,
    FilterComponent,
    HeaderComponent,
    LegendComponent,
    PropertyDataComponent,
    VisionComponent,
    VisionDetailedComponent,
    DeforestationComponent,
    DeforestationHistoryComponent,
    BurningSpotlightsComponent,
    BurningSpotlightsChartComponent,
    BurnedAreasComponent,
    BurnedAreasChartComponent,
    ImageHistoryComponent,
    ReportLegendComponent,
    AuthComponent,
    AboutComponent,
    SidebarHeaderComponent,
    SidebarFooterComponent,
    SidebarMenuComponent,
    SidebarLayerGroupComponent,
    SidebarLayerComponent,
    VisibleLayersComponent,
    PopupLinkComponent,
    GraphicsAreaComponent,
    CardAreaComponent,
    CardButtonComponent,
    ThemeAreaComponent,
    AlertTypeAreaComponent,
    AuthorizationAreaComponent,
    SpecificSearchAreaComponent,
    FooterFilterAreaComponent,
    SidebarItemComponent,
    FinalReportComponent
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
    NgxPrintModule,
    ToolbarModule,
    PDFExportModule
  ],
  providers: [
    TreeDragDropService,
    Title,
    MessageService
  ],
  entryComponents: [PopupLinkComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
