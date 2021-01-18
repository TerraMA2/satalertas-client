import {BrowserModule, Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';

import localePt from '@angular/common/locales/pt';
import {AppRoutingModule} from './app-routing.module';
import {ScrollPanelModule} from 'primeng-lts/scrollpanel';
import {SidebarModule} from 'primeng-lts/sidebar';
import {CardModule} from 'primeng-lts/card';
import {ChartModule} from 'primeng-lts/chart';
import {TableModule} from 'primeng-lts/table';
import {DragDropModule} from 'primeng-lts/dragdrop';
import {ButtonModule} from 'primeng-lts/button';
import {TooltipModule} from 'primeng-lts/tooltip';
import {DropdownModule} from 'primeng-lts/dropdown';
import {MultiSelectModule} from 'primeng-lts/multiselect';
import {PasswordModule} from 'primeng-lts/password';
import {InputTextModule} from 'primeng-lts/inputtext';
import {DialogModule} from 'primeng-lts/dialog';
import {CalendarModule} from 'primeng-lts/calendar';
import {AccordionModule} from 'primeng-lts/accordion';
import {KeyFilterModule} from 'primeng-lts/keyfilter';
import {MessageService, TreeDragDropService} from 'primeng-lts/api';
import {InputSwitchModule} from 'primeng-lts/inputswitch';
import {CheckboxModule} from 'primeng-lts/checkbox';
import {ToastModule} from 'primeng-lts/toast';
import {RadioButtonModule} from 'primeng-lts/radiobutton';
import {ToolbarModule} from 'primeng-lts/toolbar';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {ProgressSpinnerModule} from 'primeng-lts/progressspinner';
import {InputTextareaModule} from 'primeng-lts/inputtextarea';
import {ChartsModule} from 'ng2-charts';
import {TreeTableModule} from 'primeng-lts/treetable';
import {PickListModule} from 'primeng-lts/picklist';
import {RippleModule} from 'primeng-lts/ripple';
import {MessageModule} from 'primeng-lts/message';

import {AppComponent} from './app.component';
import {MapComponent} from './map/map.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TableComponent} from './map/table/table.component';
import {ReportComponent} from './report/report.component';
import {FilterComponent} from './filter/filter.component';
import {HeaderComponent} from './header/header.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {LegendComponent} from './map/legend/legend.component';
import {ReportLegendComponent} from './report/report-legend/report-legend.component';
import {PropertyDataComponent} from './report/property-data/property-data.component';
import {VisionComponent} from './report/vision/vision.component';
import {VisionDetailedComponent} from './report/vision-detailed/vision-detailed.component';
import {DeforestationComponent} from './report/deforestation/deforestation.component';
import {DeforestationHistoryProdesComponent} from './report/deforestation-history-prodes/deforestation-history-prodes.component';
import {DeforestationHistoryDeterComponent} from './report/deforestation-history-deter/deforestation-history-deter.component';
import {BurningSpotlightsComponent} from './report/burning-spotlights/burning-spotlights.component';
import {BurningSpotlightsChartComponent} from './report/burning-spotlights-chart/burning-spotlights-chart.component';
import {BurnedAreasComponent} from './report/burned-areas/burned-areas.component';
import {BurnedAreasChartComponent} from './report/burned-areas-chart/burned-areas-chart.component';
import {ImageHistoryComponent} from './report/image-history/image-history.component';
import {AuthComponent} from './auth/auth.component';
import {AboutComponent} from './about/about.component';
import {SidebarHeaderComponent} from './sidebar/sidebar-header/sidebar-header.component';
import {SidebarMenuComponent} from './sidebar/sidebar-menu/sidebar-menu.component';
import {SidebarLayerGroupComponent} from './sidebar/sidebar-menu/sidebar-layer-group/sidebar-layer-group.component';
import {SidebarItemComponent} from './sidebar/sidebar-menu/sidebar-item/sidebar-item.component';
import {SidebarFooterComponent} from './sidebar/sidebar-footer/sidebar-footer.component';
import {SidebarLayerComponent} from './sidebar/sidebar-menu/sidebar-layer-group/sidebar-layer/sidebar-layer.component';
import {VisibleLayersComponent} from './map/visible-layers/visible-layers.component';
import {PopupComponent} from './map/popup/popup.component';
import {GraphicsAreaComponent} from './dashboard/graphics-area/graphics-area.component';
import {CardAreaComponent} from './dashboard/card-area/card-area.component';
import {CardButtonComponent} from './dashboard/card-area/card-button/card-button.component';
import {ThemeAreaComponent} from './filter/theme-area/theme-area.component';
import {AlertTypeAreaComponent} from './filter/alert-type-area/alert-type-area.component';
import {AuthorizationAreaComponent} from './filter/authorization-area/authorization-area.component';
import {SpecificSearchAreaComponent} from './filter/specific-search-area/specific-search-area.component';
import {FooterFilterAreaComponent} from './filter/footer-filter-area/footer-filter-area.component';
import {FinalReportComponent} from './final-report/final-report.component';
import {HistoryDeterChartComponent} from './report/history-deter-chart/history-deter-chart.component';
import {HistoryProdesChartComponent} from './report/history-prodes-chart/history-prodes-chart.component';
import {ConfirmDialogModule} from 'primeng-lts/confirmdialog';
import {MessagesModule} from 'primeng-lts/messages';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from 'src/environments/environment';
import {ClassAreaComponent} from './filter/class-area/class-area.component';
import {ListboxModule} from 'primeng-lts/listbox';
import {LayerToolsComponent} from './map/layer-tools/layer-tools.component';
import {SliderModule} from 'primeng-lts/slider';
import {SettingsComponent} from './settings/settings.component';
import {GroupManagerComponent} from './settings/group-manager/group-manager.component';
import {GroupListComponent} from './settings/group-manager/group-list/group-list.component';
import {ModalComponent} from './modal.component/modal.component';
import {ButtonActionComponent} from './button-action.component/button-action.component';
import {LayersComponent} from './settings/layers/layers.component';
import { SettingsToolbarComponent } from './settings/settings-toolbar/settings-toolbar.component';

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
        DeforestationHistoryProdesComponent,
        DeforestationHistoryDeterComponent,
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
        PopupComponent,
        GraphicsAreaComponent,
        CardAreaComponent,
        CardButtonComponent,
        ThemeAreaComponent,
        AlertTypeAreaComponent,
        AuthorizationAreaComponent,
        SpecificSearchAreaComponent,
        FooterFilterAreaComponent,
        SidebarItemComponent,
        FinalReportComponent,
        HistoryDeterChartComponent,
        HistoryProdesChartComponent,
        ClassAreaComponent,
        LayerToolsComponent,
        SettingsComponent,
        GroupManagerComponent,
        GroupListComponent,
        ModalComponent,
        ButtonActionComponent,
        LayersComponent,
        SettingsToolbarComponent,
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
        PdfViewerModule,
        ProgressSpinnerModule,
        InputTextareaModule,
        ChartsModule,
        ConfirmDialogModule,
        MessagesModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        ListboxModule,
        SliderModule,
        TreeTableModule,
        PickListModule,
        RippleModule,
        MessageModule,
    ],
    providers: [
        TreeDragDropService,
        Title,
        MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
