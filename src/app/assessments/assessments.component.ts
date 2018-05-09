import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AssessmentsService } from '../_services/assessments.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  private _url: string = "/assets/test-data";
  assessments;
  questionnaires;
  errorMsg;

  constructor( private _assessmentsService: AssessmentsService ) { }

  ngOnInit() {
    this.getAllAsessments();
  }

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
    this.getQuestionnairesList();         

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
}
