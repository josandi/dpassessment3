export interface AssessmentData {
  assessment_id: number;
  assessment_name: string;
  description: string;
  questions_count: number;
  date_created: Date;
  deadline: Date;
  date_submitted: Date;
  status: string;
}

export interface EmployeeAssessmentStatData {
  employee_id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  email_address: string;
  contact_number: string;
  position_id: number;
  position: string;
  status: string;
}