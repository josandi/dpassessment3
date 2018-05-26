import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AssessmentsService } from '../_services/assessments.service';
import { AssessmentShowComponent } from './assessment-show/assessment-show.component';
import { AssessmentAddEditComponent } from './assessment-add-edit/assessment-add-edit.component';
import { AssessmentEmployeeComponent } from './assessment-employee/assessment-employee.component';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  assessments;
  singleAssessment;
  questionnaires;
  errorMsg;     
  userId: number;
  isAdmin: boolean = true;
  bsModalRef: BsModalRef;             // modal-related             
  assessmentShowModal: BsModalRef;
  assessmentAddEditModal: BsModalRef;
  subscriptions: Subscription[] =[];
  modalConfig = {
    keyboard: false,
    ignoreBackdropClick: false
  };

  constructor(private _assessmentsService: AssessmentsService,
              private authService: AuthService,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef ) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.userId = Number(localStorage.getItem('dpa-userid'));

    this.getAssessmentList();
  }

  // MAIN METHODS

  /* Purpose: call function to get all assessments based on the usertype; also called on modal hide */
  getAssessmentList() {
    if (this.isAdmin) {
      this.getAllAsessments(); 
    } else {
      this.getUserAsessments(this.userId);
    } 
  }

  /* Purpose: get assessments list; called if user is admin */
  getAllAsessments() {
    this._assessmentsService.getAllAssessments()
      		.subscribe(data =>
      			this.assessments = data, 
            error => this.errorMsg = error);
  }

  /* Purpose: get assessments for a specfic employee; called if user is not admin */
  getUserAsessments(employeeId) {
    this._assessmentsService.getUserAssessments(employeeId)
      		.subscribe(data =>
      			this.assessments = data, 
            error => this.errorMsg = error);
  }
  
  /* Purpose: function called when assessment is clicked; shows modal based on usertype */
  showAssessment(assessment) {
    if (this.isAdmin) {
      this.showAssessmentDetails(assessment);
    } else {
      this.showEmployeeAssessment(assessment);
    }
  }

  // MODAL DISPLAY

  /* Purpose: shows details of specific assessment; for admin */
  showAssessmentDetails(assessment) {
    const initialState = {
      assessment: assessment
    }    
    this.assessmentShowModal = this.modalService.show(
      AssessmentShowComponent, 
      Object.assign({initialState}, { class: 'modal-md' })
    );
  }

  /* Purpose: shows modal for adding/editing assessment; for admin */
  showAddEdit(assessment) {
    const initialState = {
      assessmentData: assessment,
      questionnaires: this.questionnaires
    };

    this.subscribeModal();
    this.assessmentAddEditModal = this.modalService.show(
      AssessmentAddEditComponent, 
      Object.assign(
        {initialState}, 
        {
          class: 'modal-md',
          keyboard: false,
          ignoreBackdropClick: true
        }
      )
    );
  }

  /* Purpose: shows assessment questionnaire to be answered by the employee */
  showEmployeeAssessment(assessment) {
    let employee: any = {};                                     // manually set employees data (from local storage)
    employee.aspNetUserId = this.userId;
    employee.fullName = localStorage.getItem("dpa-fullname");
    employee.position = localStorage.getItem("dpa-position");

    const initialState = {
      employee: employee,
      assessment: assessment
    }
    
    this.subscribeModal();
    this.assessmentShowModal = this.modalService.show(
      AssessmentEmployeeComponent, 
      Object.assign(
        {initialState}, 
        {
          class: 'modal-lg',
          keyboard: false,
          ignoreBackdropClick: true
        }
      )
    );
  }

  // MODAL UTILS

  /* Purpose: Refresh list after add and update */
  subscribeModal() {
    const _combine = combineLatest(Observable,
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
        this.getAssessmentList();                                // get updated assessments from db
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
