import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { LoginComponent } from './login/login.component';
import { HttpModule } from '@angular/http';
import { QuestionCategoryFilterPipe } from './_pipes/question-category-filter.pipe';
import { QuestionnaireAddEditComponent } from './questionnaires/questionnaire-add-edit/questionnaire-add-edit.component';
import { OptionGroupFilterPipe } from './_pipes/option-group-filter.pipe';
import { GroupedOptionFilterPipe } from './_pipes/grouped-option-filter.pipe';
import { AuthGuard } from './_guards/auth.guard';
import { AlertifyService } from './_services/alertify.service';
import { LoginGuard } from './_guards/login.guard';
import { AuthModule } from './auth/auth.module';
import { EmployeesResolver } from './_resolvers/employees.resolver';
import { AssessmentsResolver } from './_resolvers/assessments.resolver';
import { QuestionnairesResolver } from './_resolvers/questionnaires.resolver';
import { TeamsResolver } from './_resolvers/teams.resolver';
import { ClientsResolver } from './_resolvers/clients.resolver';
import { AssessmentQuestionnaireComponent } from './assessments/assessment-questionnaire/assessment-questionnaire.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { TopbarComponent } from './navigation/topbar/topbar.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    LoginComponent,
    QuestionCategoryFilterPipe,
    OptionGroupFilterPipe,
    GroupedOptionFilterPipe,
    AssessmentQuestionnaireComponent,
    SidebarComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    MaterialModule,
    AppRoutingModule,
    AuthModule,
    PaginationModule.forRoot()
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    AlertifyService,
    EmployeesResolver,
    TeamsResolver,
    ClientsResolver,
    AssessmentsResolver,
    QuestionnairesResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }