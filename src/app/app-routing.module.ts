import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { EmployeesComponent } from './employees/employees.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { EmployeeShowComponent } from './employees/employee-show/employee-show.component';
import { EmployeesAddEditComponent } from './employees-add-edit/employees-add-edit.component';
import { AssessmentsAddEditComponent } from './assessments-add-edit/assessments-add-edit.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'assessments', component: AssessmentsComponent },
	{ path: 'employees', component: EmployeesComponent },
	{ path: 'user-settings', component: UserSettingsComponent },
	{ path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  entryComponents : [EmployeeShowComponent,
                    EmployeesAddEditComponent,
                    AssessmentsAddEditComponent]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent,
                                  AssessmentsComponent,
                                  EmployeesComponent,
                                  UserSettingsComponent,
                                  EmployeeShowComponent,
                                  EmployeesAddEditComponent,
                                  AssessmentsAddEditComponent];
