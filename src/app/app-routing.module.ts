import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeShowComponent } from './employees/employee-show/employee-show.component';
import { TeamsComponent } from './teams/teams.component';
import { AssessmentAddEditComponent } from './assessments/assessment-add-edit/assessment-add-edit.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { QuestionnaireShowComponent } from './questionnaires/questionnaire-show/questionnaire-show.component';
import { QuestionnaireAddEditComponent } from './questionnaires/questionnaire-add-edit/questionnaire-add-edit.component';
import { AssessmentShowComponent } from './assessments/assessment-show/assessment-show.component';
import { AssessmentEmployeeComponent } from './assessments/assessment-employee/assessment-employee.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';
import { EmployeesResolver } from './_resolvers/employees.resolver';
import { TeamsResolver } from './_resolvers/teams.resolver';
import { AssessmentsResolver } from './_resolvers/assessments.resolver';
import { QuestionnairesResolver } from './_resolvers/questionnaires.resolver';
import { TeamAddEditComponent } from './teams/team-add-edit/team-add-edit.component';
import { TeamShowComponent } from './teams/team-show/team-show.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientsResolver } from './_resolvers/clients.resolver';
import { ClientShowComponent } from './clients/client-show/client-show.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'employees', component: EmployeesComponent, resolve: {employees: EmployeesResolver} },
      { path: 'teams', component: TeamsComponent, resolve: {teams: TeamsResolver} },
      { path: 'clients', component: ClientsComponent, resolve: {clients: ClientsResolver} },
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
                    TeamShowComponent,
                    TeamAddEditComponent,
                    ClientShowComponent,
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
                                  ClientsComponent,
                                  ClientShowComponent,
                                  TeamsComponent,
                                  TeamShowComponent,
                                  TeamAddEditComponent,
                                  AssessmentShowComponent,
                                  AssessmentAddEditComponent,
                                  AssessmentEmployeeComponent,
                                  QuestionnairesComponent,
                                  QuestionnaireShowComponent,
                                  QuestionnaireAddEditComponent];
