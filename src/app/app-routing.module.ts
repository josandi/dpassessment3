import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeShowComponent } from './employees/employee-show/employee-show.component';
import { AssessmentAddEditComponent } from './assessments/assessment-add-edit/assessment-add-edit.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { QuestionnaireShowComponent } from './questionnaires/questionnaire-show/questionnaire-show.component';
import { QuestionnaireAddEditComponent } from './questionnaires/questionnaire-add-edit/questionnaire-add-edit.component';
import { AssessmentShowComponent } from './assessments/assessment-show/assessment-show.component';
import { AssessmentEmployeeComponent } from './assessments/assessment-employee/assessment-employee.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';
import { EmployeesResolver } from './_resolvers/employees.resolver';
import { AssessmentsResolver } from './_resolvers/assessments.resolver';
import { QuestionnairesResolver } from './_resolvers/questionnaires.resolver';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'employees', component: EmployeesComponent, resolve: {employees: EmployeesResolver} },
      { path: 'assessments', component: AssessmentsComponent, resolve: {assessments: AssessmentsResolver} },
      { path: 'questionnaires', component: QuestionnairesComponent, resolve: {questionnaires: QuestionnairesResolver} }
    ]
  },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  entryComponents : [EmployeeShowComponent,
                    AssessmentShowComponent,
                    AssessmentAddEditComponent,
                    AssessmentEmployeeComponent,
                    QuestionnaireShowComponent,
                    QuestionnaireAddEditComponent]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent,
                                  AssessmentsComponent,
                                  EmployeesComponent,
                                  EmployeeShowComponent,
                                  AssessmentShowComponent,
                                  AssessmentAddEditComponent,
                                  AssessmentEmployeeComponent,
                                  QuestionnairesComponent,
                                  QuestionnaireShowComponent,
                                  QuestionnaireAddEditComponent];
