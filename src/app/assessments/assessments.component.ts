import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AssessmentsService } from '../_services/assessments.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AssessmentShowComponent } from './assessment-show/assessment-show.component';
import { AssessmentsAddEditComponent } from './assessments-add-edit/assessments-add-edit.component';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  private _url: string = "/assets/test-data";
  assessments;
  singleAssessment;
  questionnaires;
  errorMsg;
  bsModalRef: BsModalRef;

  constructor( private _assessmentsService: AssessmentsService,
                private modalService: BsModalService ) { }

  ngOnInit() {
    this.getAllAsessments();
    this.getQuestionnairesList();   
  }

  // get from api

  getAllAsessments() {
    this._assessmentsService.getAllAssessments()
      		.subscribe(data =>
      			this.assessments = data, 
            	error => this.errorMsg = error);
  }

  getQuestionnairesList() {
    this._assessmentsService.getQuestionnairesList()
            .subscribe(data =>
            this.questionnaires = data,
            error => this.errorMsg = error);
  }

  // modal display

  showAssessment(assessment) {
    const initialState = {
      assessment: assessment
    }    
    this.bsModalRef = this.modalService.show(
      AssessmentShowComponent, 
      Object.assign({initialState}, { class: 'modal-md' })
    );
  }

  showEdit(assessment) {
    const initialState = {
      assessmentData: assessment ,
      questionnairesData: this.questionnaires
    };

    this.bsModalRef = this.modalService.show(
      AssessmentsAddEditComponent, 
      Object.assign({initialState}, { class: 'modal-md' })
    );
  }
}
