import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../../_services/questionnaires.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-questionnaire-add-edit',
  templateUrl: './questionnaire-add-edit.component.html',
  styleUrls: ['./questionnaire-add-edit.component.scss']
})
export class QuestionnaireAddEditComponent implements OnInit {
  errorMsg;
  questionnaire: any = {};
  question: any = {};
  questionCategories: any;
  questionOptGroups: any;
  categories: any = [];
  optionsList: any;
  groupedOptions: any;
  questionFldsValid: boolean = true;

  constructor(public bsModalRef: BsModalRef,
              private _questionnaireService: QuestionnairesService ) { }

  ngOnInit() {
    this.questionnaire.questions = [];
    this.getQuestionCategories();
    this.getQuestionOptGroups();
    this.getGroupedOptions();
    this.getOptionsList();
  }

  // main functions

  addQuestionnaire() {
    if(this.questionnaire.questions.length < 1) {
      console.log("At least one question should be added!")
    }else{
      console.log(this.questionnaire);
      this.bsModalRef.hide();
    }
  }

  addQuestion() {
    let question = this.question.description;
    let category = this.question.selectedCategory;
    let optgroup = this.question.selectedOptGroup;

    this.questionFldsValid = (!question || !category || !optgroup) ? false : true;

    if(this.questionFldsValid) {
      if (!this.findCategoryInArr(category.questionCategoryId))
        this.categories.push(category);
      
      this.questionnaire.questions.push({
        'question_id': this.questionnaire.questions.length + 1,
        'question': question,
        'questionCategoryId': category.questionCategoryId,
        'optionGroupId': optgroup.optionGroupId
      });

      this.question.description = null;
    }
  }

  removeQuestion(question) {
    var qst_idx = this.questionnaire.questions.indexOf(question);
    this.questionnaire.questions.splice(qst_idx, 1);

    if(!this.findCatInQuestionsArr(question.questionCategoryId)) {
      var cat_idx = this.categories.indexOf(this.findCategoryInArr(question.questionCategoryId));
      this.categories.splice(cat_idx, 1);
    }
  }

  // get from api

  getQuestionCategories() {
    this._questionnaireService.getQuestionCategories()
      .subscribe(data =>
        this.questionCategories = data, 
        error => this.errorMsg = error,
        () => this.question.selectedCategory = this.questionCategories[0] );
  }

  getQuestionOptGroups() {
    this._questionnaireService.getQuestionOptGroups()
      .subscribe(data =>
        this.questionOptGroups = data, 
        error => this.errorMsg = error,
        () => this.question.selectedOptGroup = this.questionOptGroups[0] );
  }

  getGroupedOptions() {
    this._questionnaireService.getGroupedOptions()
      .subscribe(data =>
        this.groupedOptions= data, 
        error => this.errorMsg = error,
        () => console.log(this.groupedOptions) );
  }

  getOptionsList() {
    this._questionnaireService.getOptionsList()
      .subscribe(data =>
        this.optionsList= data, 
        error => this.errorMsg = error);
  }

  // utilities

  findCategoryInArr(catId) {
    return this.categories.find(x => x.questionCategoryId == catId);
  }

  findCatInQuestionsArr(catId) {
    return this.questionnaire.questions.find(x => x.questionCategoryId == catId);
  }

}
