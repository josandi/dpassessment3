import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../../_services/questionnaires.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-questionnaire-show',
  templateUrl: './questionnaire-show.component.html',
  styleUrls: ['./questionnaire-show.component.scss']
})
export class QuestionnaireShowComponent implements OnInit {
  errorMsg: any;
  questionnaire: any = {};
  categories: any = [];
  groupedOptions: any;

  constructor(private bsModalRef: BsModalRef,
              private _questionnaireService: QuestionnairesService) { }

  ngOnInit() {
    this.getQuestionnaire(this.questionnaire.questionaireId);
    this.getGroupedOptions();
  }

  getQuestionnaire(questionnaireId) {
    this._questionnaireService.getQuestionnaire(questionnaireId)
      .subscribe(data =>
        this.questionnaire = data, 
        error => this.errorMsg = error,
        () => {
          this.getCategoriesFromQuestionsArr(this.questionnaire.questionWithOptions);
        }
      );
  }

  getGroupedOptions() {
    this._questionnaireService.getGroupedOptions()
      .subscribe(data =>
        this.groupedOptions= data, 
        error => this.errorMsg = error);
  }

  // UTILITIES

  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

  arrayHasData(arr) {
    return (arr.length > 0) ? true : false;
  }

  closeModal() {
    this.bsModalRef.hide();
  }

}
