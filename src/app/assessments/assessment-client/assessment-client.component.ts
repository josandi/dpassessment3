import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssessmentsService } from '../../_services/assessments.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-assessment-client',
  templateUrl: './assessment-client.component.html',
  styleUrls: ['./assessment-client.component.scss']
})
export class AssessmentClientComponent implements OnInit {
  assessment: any = {};
  routeHash: string;

  constructor(private _assessmentsService: AssessmentsService,
              private route: ActivatedRoute,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.getRouteHash();
    this.getAssessmentDetails();
  }

  // MAIN FUNCTIONS

  /* Purpose: get route hash */
  getRouteHash() {
    this.routeHash = this.route.snapshot.params.hash;
  }

  /* Purpose: get values assessment details using route snapshot */
  getAssessmentDetails() {
    this._assessmentsService.getAssessmentDetailsByHash(this.routeHash)
      .subscribe(data => 
        this.assessment = data,
        error => this.alertify.error(error)
      )
  }

  /* Purpose: submit answered assessment */
  submitAnsweredAssessment(answeredAssessment: any) {
    console.log(answeredAssessment);
    console.log('Assessment successfully submitted!');
    this.getAssessmentDetails();
  }
}
