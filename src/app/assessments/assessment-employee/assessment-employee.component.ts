import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionnairesService } from '../../_services/questionnaires.service';
import { AssessmentsService } from '../../_services/assessments.service';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-assessment-employee',
  templateUrl: './assessment-employee.component.html',
  styleUrls: ['./assessment-employee.component.scss']
})
export class AssessmentEmployeeComponent implements OnInit {

  errorMsg: any;
  employee: any;
  assessment: any;
  questionnaire: any = {};
  categories: any = [];
  groupedOptions: any;
  currAssessmentStatus: string;
  enableFields: boolean = false;

  constructor(private bsModalRef: BsModalRef,
              private authService: AuthService,
              private _assessmentService: AssessmentsService,
              private _questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.getEmpAssessmentQuestionnaire();
    this.initializeValues();
  }

  initializeValues() {
    this.currAssessmentStatus = (this.employee.status) ?        // check where the value is from; since this component is called from different components
    this.employee.status : this.assessment.status;

    this.enableFields = (this.assessment.status== 'Unanswered' && !this.authService.isAdmin()) ?
      true : false;                                             // questionnaire can only be answered when the user role is not admin and status is still unanswered
  }

  submitQuestionnaire() {
    if (this.enableFields) {
      console.log(this.questionnaire);
      this.closeModal();
    }
  }

  // API GET

  getEmpAssessmentQuestionnaire() {
    this._assessmentService.getEmpAssessmentQuestionnaire(
      this.employee.aspNetUserID, 
      this.assessment.assessmentId, 
      4                             // TEMPORARY: static questionnaire Id while endpoint is not done yet
    )
      .subscribe(data =>
        this.questionnaire = data, 
        error => this.errorMsg = error,
        () => {
          this.getCategoriesFromQuestionsArr(this.questionnaire.questionWithOptions);
        } 
      );
  }

  // UTILITIES

  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  arrayHasData(arr) {
    return (arr.length > 0) ? true : false;
  }

}
