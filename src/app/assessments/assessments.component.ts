import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { AssessmentsService } from '../_services/assessments.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AssessmentShowComponent } from './assessment-show/assessment-show.component';
import { AssessmentsAddEditComponent } from './assessments-add-edit/assessments-add-edit.component';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AssessmentEmployeeComponent } from './assessment-employee/assessment-employee.component';

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
  userId: number;
  isAdmin: boolean = true;
  bsModalRef: BsModalRef;
  subscriptions: Subscription[] =[];

  constructor(private _assessmentsService: AssessmentsService,
              private authService: AuthService,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef ) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.userId = Number(localStorage.getItem('dpa-userid'));

    this.getAssessmentList();
  }

  /* Purpose: call function to get all assessments based on the usertype; reused in modal onHide */
  getAssessmentList() {
    if (this.isAdmin) {
      this.getAllAsessments(); 
    } else {
      this.getUserAsessments(this.userId);
    } 
  }
  
  /* Purpose: function called when assessment is clicked; displayed modal is based on usertype */
  showAssessment(assessment) {
    if (this.isAdmin) {
      this.showAssessmentDetails(assessment);
    } else {
      this.showEmployeeAssessment(assessment);
    }
  }

  // API GET

  getAllAsessments() {
    this._assessmentsService.getAllAssessments()                // for admin
      		.subscribe(data =>
      			this.assessments = data, 
            error => this.errorMsg = error);
  }

  getUserAsessments(employeeId) {                               // for user: with status
    this._assessmentsService.getUserAssessments(employeeId)
      		.subscribe(data =>
      			this.assessments = data, 
            error => this.errorMsg = error);
  }

  // MODAL DISPLAY

  showAssessmentDetails(assessment) {
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

  showEmployeeAssessment(assessment) {
    let employee: any = {};                                     // manually set employees data (from local storage)
    employee.fullName = this.userId;
    employee.fullName = localStorage.getItem("dpa-fullname");
    employee.position = localStorage.getItem("dpa-position");

    const initialState = {
      employee: employee,
      assessment: assessment
    }    
    this.assessmentShowModal = this.modalService.show(
      AssessmentEmployeeComponent, 
      Object.assign({initialState}, { class: 'modal-lg' })
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
