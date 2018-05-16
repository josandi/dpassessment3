import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../../_services/questionnaires.service';

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
  questionFldsValid: boolean = true;

  constructor( private _questionnaireService: QuestionnairesService ) { }

  ngOnInit() {
    this.questionnaire.questions = [];
    this.getQuestionCategories();
    this.getQuestionOptGroups();
    this.getOptionsList();
  }

  // main functions 

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

  getOptionsList() {
    this._questionnaireService.getOptionsList()
      .subscribe(data =>
        this.optionsList= data, 
        error => this.errorMsg = error,
        () => console.log(this.optionsList) );
  }

  // utilities

  findCategoryInArr(catId) {
    return this.categories.find(x => x.questionCategoryId == catId);
  }

}
