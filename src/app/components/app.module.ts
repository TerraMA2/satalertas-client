import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// import localePt from '@angular/common/locales/pt';
// import localeEs from '@angular/common/locales/es';

import { AppRoutingModule } from './app-routing.module';

import { PanelMenuModule } from 'primeng/panelmenu';
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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TreeModule } from 'primeng/tree';
import { TreeDragDropService, MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TableComponent } from './map/table/table.component';
import { ReportComponent } from './report/report.component';
import { FilterComponent } from './map/filter/filter.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LegendComponent } from './map/legend/legend.component';
import { ReportLegendComponent } from './report/report-legend/report-legend.component';
import { PropertyDataComponent } from './report/property-data/property-data.component';
import { VisionComponent } from './report/vision/vision.component';
import { VisionDetailedComponent } from './report/vision-detailed/vision-detailed.component';
import { DeforestationComponent } from './report/deforestation/deforestation.component';
import { DeforestationHistoryComponent } from './report/deforestation-history/deforestation-history.component';
import { BurningSpotlightsComponent } from './report/burning-spotlights/burning-spotlights.component';
import { BurningFocusChartComponent } from './report/burning-focus-chart/burning-focus-chart.component';
import { BurnedAreasComponent } from './report/burned-areas/burned-areas.component';
import { BurnedAreasChartComponent } from './report/burned-areas-chart/burned-areas-chart.component';
import { ImageHistoryComponent } from './report/image-history/image-history.component';
import { AuthComponent } from './auth/auth.component';
import { AboutComponent } from './about/about.component';
import { SidebarHeaderComponent } from './sidebar/sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar/sidebar-menu/sidebar-menu.component';
import { SidebarItemComponent } from './sidebar/sidebar-menu/sidebar-item/sidebar-item.component';
import { SidebarFooterComponent } from './sidebar/sidebar-footer/sidebar-footer.component';
import { SidebarItemChildComponent } from './sidebar/sidebar-menu/sidebar-item/sidebar-item-child/sidebar-item-child.component';
import { ToolsComponent } from './map/tools/tools.component';
import { LayersComponent } from './map/layers/layers.component';

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
    FooterComponent,
    LegendComponent,
    PropertyDataComponent,
    VisionComponent,
    VisionDetailedComponent,
    DeforestationComponent,
    DeforestationHistoryComponent,
    BurningSpotlightsComponent,
    BurningFocusChartComponent,
    BurnedAreasComponent,
    BurnedAreasChartComponent,
    ImageHistoryComponent,
    ReportLegendComponent,
    AuthComponent,
    AboutComponent,
    SidebarHeaderComponent,
    SidebarFooterComponent,
    SidebarMenuComponent,
    SidebarItemComponent,
    SidebarItemChildComponent,
    ToolsComponent,
    LayersComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OverlayPanelModule,
    PanelMenuModule,
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
    TreeModule,
    SelectButtonModule,
    InputSwitchModule,
    CheckboxModule,
    ToastModule,
    RadioButtonModule
  ],
  providers: [
    TreeDragDropService,
    Title,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
