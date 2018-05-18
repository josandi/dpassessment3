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
  assessmentShowModal: BsModalRef;
  assessmentAddEditModal: BsModalRef;
  assessments;
  singleAssessment;
  questionnaires;
  errorMsg;
  bsModalRef: BsModalRef;

  constructor( private _assessmentsService: AssessmentsService,
                private modalService: BsModalService ) { }

  ngOnInit() {
    this.getAllAsessments();  
  }

  deleteAssessment(assessment) {
    console.log("Delete clicked");
    console.log(assessment);
  }

  // get from api

  getAllAsessments() {
    this._assessmentsService.getAllAssessments()
      		.subscribe(data =>
      			this.assessments = data, 
            	error => this.errorMsg = error);
  }

  // modal display

  showAssessment(assessment) {
    const initialState = {
      assessment: assessment
    }    
    this.assessmentShowModal = this.modalService.show(
      AssessmentShowComponent, 
      Object.assign({initialState}, { class: 'modal-md' })
    );
  }

  showAddEdit(assessment) {
    const initialState = {
      assessmentData: assessment,
      questionnaires: this.questionnaires
    };

    this.assessmentAddEditModal = this.modalService.show(
      AssessmentsAddEditComponent, 
      Object.assign({initialState}, { class: 'modal-md' })
    );
  }
}
