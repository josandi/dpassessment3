import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssessmentsService } from '../../_services/assessments.service';
import { AlertifyService } from '../../_services/alertify.service';
import { QuestionnairesService } from '../../_services/questionnaires.service';

@Component({
  selector: 'app-assessment-questionnaire',
  templateUrl: './assessment-questionnaire.component.html',
  styleUrls: ['./assessment-questionnaire.component.scss']
})
export class AssessmentQuestionnaireComponent implements OnInit {
  @Output() submitAnsweredAssessment = new EventEmitter(); 
  private _assessment: any;
  questionnaire: any = {};
  categories: any = [];
  enableFields: boolean = true;

  constructor(private _assessmentService: AssessmentsService,
              private _questionnaireService: QuestionnairesService,
              private alertify: AlertifyService) { }

  get assessment(): any {
    return this._assessment;
  }
              
  @Input()
  set assessment(assessment: any) {
    this._assessment = assessment;
    
    if(Object.keys(this._assessment).length !== 0){    // to load only once and when the assessment is set
      this.getEmployeeAssessment(this._assessment.assessmentId);
    }
  }

  ngOnInit() { 
  }

  // MAIN FUNCTIONS
  
  /* Purpose: retrieves all the necessary data for the view */
   getEmployeeAssessment(assessmentId) {     
    this._assessmentService.getAssessmentDetail(assessmentId)
      .subscribe(data =>
        this._assessment = data, 
        error => this.alertify.error(error),
        () => {    
          this.getQuestionnaire(this._assessment.questionaireId);
        } 
      );
  }

  submitQuestionnaire() {
    let answeredAssessment: any = {};

    if (this.enableFields) {
      if (this.hasAnsweredAllQuestions()) {
        answeredAssessment = this.getAnsweredAssessmentToSubmit();
        this.submitAnsweredAssessment.emit(answeredAssessment);
      } else {
        this.alertify.error('All questions must be answered.')
      }      
    }
  }

  /* Purpose: gets entire questionnaire; called when status is unanswered*/
  getQuestionnaire(questionnaireId) {
    this._questionnaireService.getQuestionnaire(questionnaireId)
      .subscribe(data =>
        this.questionnaire = data, 
        error => this.alertify.error(error),
        () => {
          this.getCategoriesFromQuestionsArr(this.questionnaire.questionWithOptions);
        } 
      );
  }

  // API UTILITIES

  /* Purpose: called when option selection has changed; sets selected answer to the specific question*/
  setSelectedOptionToModel(questionId, option) {
    let qIdx = this.questionnaire.questionWithOptions             // get index of the answered question then set to model properly
      .findIndex(question => question.questionId == questionId);

    this.questionnaire.questionWithOptions[qIdx].employeeAnswer = option.optionsId;
  }

  /* Purpose: condition to check if the display should be group of radio buttons or a textarea */
  arrayHasData(arr) {
    return (arr.length > 0) ? true : false;
  }


  // UTILITIES

  /* Purpose: sets categories array based on the questions set*/
  getCategoriesFromQuestionsArr(questions) {
    this.categories = this._questionnaireService.getCategoriesFromQuestionsArr(questions);
  }

  /* Purpose: validates if all questions has been answered */
  hasAnsweredAllQuestions() {
    for (let question of this.questionnaire.questionWithOptions) {
      if(!question.employeeAnswer)
        return false;
    }
    return true;
  }

  /* Purpose: format answered questionnaire to fit format on post api */
  getAnsweredAssessmentToSubmit() {
    let emp: any = {};
    let answers = [];
    let idx = 0;

    emp.employeeAssessment = {};
    emp.employeeAssessment.assessmentId = this.assessment.assessmentId; // IDs
    emp.employeeAssessmentAnswers = [];                                 // initialize array

    this.questionnaire.questionWithOptions.forEach(question => {        // loop questions
      answers[idx] = {};
      answers[idx].employeeAssessmentId = 0;
      answers[idx].questionId = question.questionId;
      answers[idx].answer = question.employeeAnswer;
      idx++;
    });

    emp.employeeAssessmentAnswers = answers;
    return emp;
  }

}
