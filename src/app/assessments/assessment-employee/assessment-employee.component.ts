import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { QuestionnairesService } from '../../_services/questionnaires.service';

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
              private _questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.getQuestionnaire(this.assessment.questionnaire_id);
    this.getGroupedOptions();
  }

  getQuestionnaire(questionnaireId) {
    this._questionnaireService.getQuestionnaire(questionnaireId)
      .subscribe(data =>
        this.questionnaire = data, 
        error => this.errorMsg = error,
        () => {
          this.getCategoriesFromQuestionsArr(this.questionnaire.questions);
        } 
      );
  }

  getGroupedOptions() {
    this._questionnaireService.getGroupedOptions()
      .subscribe(data =>
        this.groupedOptions= data, 
        error => this.errorMsg = error);
  }

  // utilities

  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

  closeModal() {
    this.bsModalRef.hide();
  }

}
