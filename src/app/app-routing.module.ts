import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { EmployeesComponent } from './employees/employees.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { EmployeesAddEditComponent } from './employees-add-edit/employees-add-edit.component';
import { AssessmentsAddEditComponent } from './assessments-add-edit/assessments-add-edit.component';


const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'assessments', component: AssessmentsComponent },
	{ path: 'employees', component: EmployeesComponent },
	{ path: 'user-settings', component: UserSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  entryComponents : [EmployeesAddEditComponent,
                    AssessmentsAddEditComponent]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent,
                                  AssessmentsComponent,
                                  EmployeesComponent,
                                  UserSettingsComponent,
                                  EmployeesAddEditComponent,
                                  AssessmentsAddEditComponent];
