import { Component, OnInit } from '@angular/core';
import { QuestionnairesService } from '../../_services/questionnaires.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-questionnaire-add-edit',
  templateUrl: './questionnaire-add-edit.component.html',
  styleUrls: ['./questionnaire-add-edit.component.scss']
})
export class QuestionnaireAddEditComponent implements OnInit {
  errorMsg;
  isEdit: boolean = false;
  btnSubmitName: string = "Save";
  questionnaire: any = {};
  question: any = {};
  questionCategories: any;
  questionOptGroups: any;
  categories: any = [];
  optionsList: any;
  groupedOptions: any;
  questionFldsValid: boolean = true;

  questionnairePostResponse: any = {};

  constructor(public bsModalRef: BsModalRef,
              private alertify: AlertifyService,
              private _questionnaireService: QuestionnairesService ) { }

  ngOnInit() {
    if (Object.keys(this.questionnaire).length > 0) {             // for edit
      this.isEdit = true;
      this.btnSubmitName = 'Update';
      this.getQuestionnaire(this.questionnaire.questionaireId);
    }

    this.questionnaire.questionWithOptions = [];
    this.getQuestionCategories();
    this.getQuestionOptGroups();
    this.getGroupedOptions();
    this.getOptionsList();
  }

  // MAIN FUNCTIONS

  submitQuestionnaire() {
    if (this.isEdit) {
      this.updateQuestionnaire();
    } else {
      if(this.questionnaire.questionWithOptions.length < 1) {
        this.alertify.error("At least one question should be added!")
      }else{
        this.saveQuestionnaire();
      }
    }
  }

  addQuestion() {
    let questionToAdd: any = {};
    let question = this.question.description;
    let category = this.question.selectedCategory;
    let optgroup = this.question.selectedOptGroup;

    this.questionFldsValid = (!question || !category || !optgroup) ? false : true;

    if(this.questionFldsValid) {
      if (!this._questionnaireService.findCategoryInArr(this.categories, category.questionCategoryId))
        this.categories.push(category);

      questionToAdd = {
        'questionId': this.questionnaire.questionWithOptions.length + 1,
        'questionDescription': question,
        'questionCategoryId': category.questionCategoryId,
        'optionGroupId': optgroup.optionGroupId,
        'questionOptions': this.getOptionGroupFromArray(optgroup.optionGroupId)
      }
      
      this.questionnaire.questionWithOptions.push(questionToAdd);
      if (this.isEdit) {                // save directly to database if edit
        questionToAdd.questionaireId = this.questionnaire.questionaireId;
        this.saveQuestion(questionToAdd);
      }

      this.question.description = null;
    }
  }

  removeQuestion(question) {
    if (this.isEdit) {
      this.alertify.confirm(
        'This action will remove the question from the database. Proceed?',
        () => {
          this.deleteQuestion(question.questionId);                   // remove directly from database if edit
          this.removeQuestionFromArray(question);
        }
      )
    } else {
      this.removeQuestionFromArray(question);
    }
  }

  removeQuestionFromArray(question) {
    let categoryId = question.questionCategoryId;
    let qst_idx = this.questionnaire.questionWithOptions.indexOf(question);
    
    this.questionnaire.questionWithOptions.splice(qst_idx, 1);    // remove question from array

    if(!this.findCatInQuestionsArr(categoryId)) {                 // remove from category array if no more questions from that category
      let category = this._questionnaireService.findCategoryInArr(this.categories, categoryId);
      let cat_idx = this.categories.indexOf(category);
      this.categories.splice(cat_idx, 1);
    }
  }

  // API METHODS

  /* Purpose: Save new questionnaire */
  saveQuestionnaire() {
    let questionnaireId: number;

    this._questionnaireService.saveQuestionnaire(this.getQuestionnaireOnlyAttributes())   // post questionaire and get returned questionnaire id
      .subscribe(
        data => questionnaireId = data,
        error => this.errorMsg = error,
        () => {
          if(questionnaireId){
            this.questionnaire.questionWithOptions.forEach(question => {                // add returned questionnaire id to each question
              question.questionaireId = questionnaireId;
            });

            this.saveQuestions(this.questionnaire.questionWithOptions);                 // post array to questions table
          } else {
            this.alertify.error('Saving questionnaire - failed!');
          }
        }
      );

    this.bsModalRef.hide();
  }

  /* Purpose: Update questionnaire */
  updateQuestionnaire() {
    let response: any;
    
    this._questionnaireService.updateQuestionnaire(this.getQuestionnaireOnlyAttributes())
      .subscribe(
        data => response = data,
        error => this.errorMsg = error,
        () => { 
          if (response) {
            this.alertify.success('Questionnaire - successfully updated!');
          } else {
            this.alertify.error('Updating questionnaire - failed!');
          }
          this.bsModalRef.hide();
        }
      );

  }

  /* Purpose: used for saving one question object only; used in update */
  saveQuestion(questionObj) {
    let response: any;
    let questionArr: any = [];

    questionArr.push(questionObj);      // manually push one question object to array

    this._questionnaireService.saveQuestions(questionArr)
      .subscribe(
        data => response = data,
        error => this.errorMsg = error,
        () => {
          if (response) {
            this.alertify.success('Question successfully added to database');
          } else {
            this.alertify.error('Saving question - failed!');
          }
        }
      );
  }

  /* Purpose: Saving array of question objects; used in save */
  saveQuestions(questionsArr) {
    let response: any;

    this._questionnaireService.saveQuestions(this.questionnaire.questionWithOptions)
      .subscribe(
        data => response = data,
        error => this.errorMsg = error,
        () => { 
          if (response) {
            this.alertify.success('Questionnaire saved successfully!');
          } else {
            this.alertify.error('Saving questionnaire - failed!');
          }
        }
      );
  }

  /* Delete one question from database */
  deleteQuestion(questionId) {
    let response: any;

    this._questionnaireService.deleteQuestion(questionId)
    .subscribe(
      data => response = data,
      error => this.errorMsg = error,
      () => { 
        if (response) {
          this.alertify.success('Question was deleted successfully!');
        } else {
          this.alertify.error('Failed to delete question!');
        }
      }
    );
  }  

  // API GET

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

  // UTILITIES

  findCatInQuestionsArr(catId) {
    return this.questionnaire.questionWithOptions.find(x => x.questionCategoryId == catId);
  }

  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

  getOptionGroupFromArray(optgroupId) {
    return this.groupedOptions.find(x => x.optionGroupId == optgroupId).options;
  }

  arrayHasData(arr) {
    return (arr.length > 0) ? true : false;
  }

  /* Purpose: get questionnaire details only; used for saving/updating questionnaire table */
  getQuestionnaireOnlyAttributes() {
    let questionnaireData: any = {};

    questionnaireData.questionaireId = this.questionnaire.questionaireId;
    questionnaireData.questionaireDescription = this.questionnaire.questionaireDescription;
    questionnaireData.questionaireInstructions = this.questionnaire.questionaireInstructions;

    return questionnaireData;
  }

}
