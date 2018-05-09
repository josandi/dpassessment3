import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AssessmentsService } from '../_services/assessments.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AssessmentsAddEditComponent } from '../assessments-add-edit/assessments-add-edit.component';

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

  showEdit(assessment) {
    this.singleAssessment = assessment;
    const initialState = {
        assessmentData: this.singleAssessment ,
        questionnairesData: this.questionnaires,
        title: 'Modal with component',
        closeBtnName: 'Cancel'
      };
      this.bsModalRef = this.modalService.show(AssessmentsAddEditComponent, {initialState});
      this.bsModalRef.content.closeBtnName = 'Close';

    /*$ngConfirm({
        title: '',
        scope: $scope,
        contentUrl: 'admin/assessments/assessment-add.html',
        type: 'orange',
        closeIcon: true,
        escapeKey: true,
        backgroundDismiss: true,
        buttons: {
            btn: {
                text: 'Save',
                btnClass: 'btn-warning',
                action: function(scope, button){
                    console.log(vm.assessment);
                }
            }
        }
    });*/
  }

  ngOnInit() {
    this.getAllAsessments();
    this.getQuestionnairesList();   
  }
}
