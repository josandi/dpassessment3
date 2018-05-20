import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionnairesService } from '../../_services/questionnaires.service';
import { AssessmentsService } from '../../_services/assessments.service';

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

  constructor(private bsModalRef: BsModalRef,
              private _assessmentService: AssessmentsService,
              private _questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.getEmpAssessmentQuestionnaire();
  }

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

  // utilities

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
