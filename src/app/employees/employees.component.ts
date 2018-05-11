import { Component, OnInit } from '@angular/core';
// import { EmployeesService } from './../service/employees.service';
import { EmployeesService } from '../_services/employees.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmployeesAddEditComponent } from '../employees-add-edit/employees-add-edit.component';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

	pageEmployees;
	errorMsg;
	pagination = {
		currentPage: 1,
		numPerPage: 15,
		maxSize: 5
	};
	empPositions = [];
	selectedPosition = {};
	isShowOnly = false;
	employee;
	bsModalRef: BsModalRef;

  constructor( private _employeeService: EmployeesService, 
  			   private modalService: BsModalService ) { }

	ngOnInit() {
		this.getAllEmployees();
		this.getEmployeePositionList();
	}

	getAllEmployees() {
	    this._employeeService.getAllEmployees()
      		.subscribe(data =>
      			this.pageEmployees = data, 
				error => this.errorMsg = error);
	}

	getEmployeePositionList() {
	    this._employeeService.getPositionList()
	    	.subscribe(data => 
	    		this.empPositions = data,
	    		error => this.errorMsg = error);
	}

	getEmployeeAssessments(empId) {
	    this._employeeService.getEmployeeAssessments(empId)
	    	.subscribe(data =>
	    		this.empPositions = data, 
	    		error => this.errorMsg = error);
	}

	deleteEmployee(employee) {
	    console.log("deleteEmployee clicked!");
	}

	// modal display

	showEmployee(employee) {
		this.isShowOnly = false;
	    this.employee = employee;

	    const initialState = {
	      employeeData: this.employee,
		  positionList: this.empPositions,
		  selectedPosition: 1,
	      title: 'Modal with component',
	      btnName: employee ? 'Update' : 'Save'
	    };
	    this.bsModalRef = this.modalService.show(EmployeesAddEditComponent, {initialState});
	    this.bsModalRef.content.closeBtnName = 'Close';
	}

	showEdit(employee) {
	    this.isShowOnly = false;
	    this.employee = employee;

	    const initialState = {
	      employeeData: this.employee,
		  positionList: this.empPositions,
		  selectedPosition: 1,
	      title: 'Modal with component',
	      btnName: employee ? 'Update' : 'Save'
	    };
	    this.bsModalRef = this.modalService.show(EmployeesAddEditComponent, {initialState});
	    this.bsModalRef.content.closeBtnName = 'Close';
	}

	/*getPosition(posId) {
	    return $filter('filter')(this.empPositions, {position_id: posId })[0]
	}*/

	/*showUserAssessment(assessment) {
	    console.log("showUserAssessment: " + assessment.assessment_name);
	}

	getPageEmployees(){
	    if(vm.employees){
	        var begin = ((vm.pagination.currentPage - 1) * vm.pagination.numPerPage);
	        var end = begin + vm.pagination.numPerPage;
	        vm.pageEmployees = vm.employees.slice(begin, end);
	    }
	}

	concatWithSpace(str1, str2) {
	    var strConcat = str1 + ' ' + str2;
	    return strConcat.trim();
	}

	getFullName(employee) {
	    var concatLname = concatWithSpace(employee.middlename, employee.lastname);
	    return concatWithSpace(employee.firstname, concatLname);
	}
	
	// modal display
	
	showEmployee(employee) {
	    this.isShowOnly = true;
	    this.employee = employee;
	    this.selectedPosition = getPosition(employee.position_id);
	    getEmployeeAssessments(vm.employee.employee_id);

	    $ngConfirm({
	        title: '',
	        scope: $scope,
	        contentUrl: 'admin/employees/employee-show.html',
	        type: 'orange',
	        closeIcon: true,
	        escapeKey: true,
	        backgroundDismiss: true,
	        buttons: {
	            btn: {
	                text: 'Close',
	                btnClass: 'btn-warning',
	                action: function(scope, button){
	                    
	                }
	            }
	        }
	    });
	}
	*/

}
