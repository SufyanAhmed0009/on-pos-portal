import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BidiModule } from '@angular/cdk/bidi';
import { NgxPrintModule } from 'ngx-print';

/* FROM ANGULAR MATERIAL */
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatList } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip'
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';

/* ANGULAR MAPS MODULE */
import { AgmCoreModule } from '@agm/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { AppConstants } from '../core/static/app-constants';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PageBoxComponent } from './components/page-box/page-box.component';
import { SearchSliceComponent } from './components/search-slice/search-slice.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StatusSelectorComponent } from './selectors/status-selector/status-selector.component';
import { DateRangeSelectorComponent } from './selectors/date-range-selector/date-range-selector.component';
import { DataLoaderComponent } from './components/data-loader/data-loader.component';
import { StoresSelectorComponent } from './selectors/stores-selector/stores-selector.component';
import { ProductByBarcodeSelectorComponent } from './selectors/product-by-barcode-selector/product-by-barcode-selector.component';
import { ProductByNameSelectorComponent } from './selectors/product-by-name-selector/product-by-name-selector.component';
import { SingleDateSelectorComponent } from './selectors/single-date-selector/single-date-selector.component';
import { ProductFindSelectorComponent } from './selectors/product-find-selector/product-find-selector.component';
import { StrToNumPipe } from './pipes/str-to-num.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LibraryProductFindSelectorComponent } from './selectors/library-product-find-selector/library-product-find-selector.component';
import { ProductBarcodeFindSelectorComponent } from './selectors/product-barcode-find-selector/product-barcode-find-selector.component';
import { ModalSharedInfoComponent } from './components/modal-info/modal-info.component';

@NgModule({
    exports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatGridListModule,
        HttpClientModule,
        MatDialogModule,
        MatStepperModule,
        MatButtonModule,
        NgxPrintModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatChipsModule,
        MatIconModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatButtonToggleModule,
        MatListModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatTooltipModule,
        NavigationComponent,
        MatTableModule,
        MatSnackBarModule,
        PageBoxComponent,
        StatusSelectorComponent,
        MatBadgeModule,
        CdkScrollableModule,
        ScrollingModule,
        SearchSliceComponent,
        DateRangeSelectorComponent,
        DataLoaderComponent,
        StoresSelectorComponent,
        ProductByNameSelectorComponent,
        ProductByBarcodeSelectorComponent,
        SingleDateSelectorComponent,
        ProductFindSelectorComponent,
        LibraryProductFindSelectorComponent,
        StrToNumPipe,
        ConfirmDialogComponent,
        ProductBarcodeFindSelectorComponent,
        ModalSharedInfoComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //FROM ANGULAR MATERIAL.
        MatAutocompleteModule,
        MatRadioModule,
        MatGridListModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatCheckboxModule,
        MatTreeModule,
        MatExpansionModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatBadgeModule,
        MatTooltipModule,
        MatDatepickerModule,
        //ANGULAR MAPS.
        AgmCoreModule.forRoot(AppConstants.MAPS_CONFIG)
    ],
    declarations: [
        NavigationComponent,
        PageBoxComponent,
        SearchSliceComponent,
        StatusSelectorComponent,
        DateRangeSelectorComponent,
        DataLoaderComponent,
        StoresSelectorComponent,
        ProductByBarcodeSelectorComponent,
        ProductByNameSelectorComponent,
        SingleDateSelectorComponent,
        ProductFindSelectorComponent,
        StrToNumPipe,
        ConfirmDialogComponent,
        LibraryProductFindSelectorComponent,
        ProductBarcodeFindSelectorComponent,
        ModalSharedInfoComponent,
    ]
})
export class SharedModule { }
