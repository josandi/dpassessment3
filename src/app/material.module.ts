import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { 
    MatDialogModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelect,
    MatSelectModule,
    MatOptionModule,
    MatOption,
    MatRadioButton,
    MatRadioButtonBase,
    MatRadioModule,
    MatTableDataSource,
    MatTable,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
} from '@angular/material';
@NgModule({
    declarations: [

    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatOptionModule,
        MatIconModule,
        MatSelectModule,
        MatNativeDateModule,
        MatRadioModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    exports: [
        MatSnackBarModule,
        MatDialogModule,
        MatRadioModule,
        MatButtonModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatDatepickerModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatNativeDateModule],
    providers: [],
})
export class MaterialModule { }