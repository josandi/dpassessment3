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
    if (Object.keys(this.questionnaire).length === 0) {           // for add
      this.questionnaire.questions = [];
    } else {                                                      // for edit
      this.getQuestions(this.questionnaire.questionaireId);
    }

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
      if (!this._questionnaireService.findCategoryInArr(this.categories, category.questionCategoryId))
        this.categories.push(category);
      
      this.questionnaire.questions.push({
        'questionId': this.questionnaire.questions.length + 1,
        'question': question,
        'questionCategoryId': category.questionCategoryId,
        'optionGroupId': optgroup.optionGroupId
      });

      this.question.description = null;
    }
  }

  removeQuestion(question) {
    let categoryId = question.questionCategoryId;
    let qst_idx = this.questionnaire.questions.indexOf(question);
    
    this.questionnaire.questions.splice(qst_idx, 1);

    if(!this.findCatInQuestionsArr(categoryId)) {
      let category = this._questionnaireService.findCategoryInArr(this.categories, categoryId);
      let cat_idx = this.categories.indexOf(category);
      this.categories.splice(cat_idx, 1);
    }
  }

  // get from api

  getQuestions(questionnaireId) {
    this._questionnaireService.getQuestions(questionnaireId)
      .subscribe(data =>
        this.questionnaire.questions = data, 
        error => this.errorMsg = error,
        () => {
          this.getCategoriesFromQuestionsArr(this.questionnaire.questions);
        } 
      );
  }

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
        error => this.errorMsg = error);
  }

  getOptionsList() {
    this._questionnaireService.getOptionsList()
      .subscribe(data =>
        this.optionsList= data, 
        error => this.errorMsg = error);
  }

  // utilities

  findCatInQuestionsArr(catId) {
    return this.questionnaire.questions.find(x => x.questionCategoryId == catId);
  }

  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

}
