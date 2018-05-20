import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { AssessmentsService } from '../_services/assessments.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AssessmentShowComponent } from './assessment-show/assessment-show.component';
import { AssessmentsAddEditComponent } from './assessments-add-edit/assessments-add-edit.component';
import { combineLatest, Observable, Subscription } from 'rxjs';

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
  subscriptions: Subscription[] =[];

  constructor(private _assessmentsService: AssessmentsService,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef ) { }

  ngOnInit() {
    this.getAllAsessments();  
  }

  // API GET

  getAllAsessments() {
    this._assessmentsService.getAllAssessments()
      		.subscribe(data =>
      			this.assessments = data, 
            error => this.errorMsg = error);
  }

  // API CALLS

  deleteAssessment(assessment) {
    
  }

  // MODAL DISPLAY

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

    this.subscribeModal();
    this.assessmentAddEditModal = this.modalService.show(
      AssessmentsAddEditComponent, 
      Object.assign({initialState}, { class: 'modal-md' })
    );
  }

  /* Purpose: Refresh list after add and update */
  subscribeModal() {
    const _combine = combineLatest(Observable,
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        this.getAllAsessments();                                // get updated assessments from db
      })
    )

    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.unsubscribeModal();                                // unsubscribe after modal is hidden
      })
    )

    this.subscriptions.push(_combine);
  }

  unsubscribeModal() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

}
