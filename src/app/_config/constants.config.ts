export const API = {
  END_POINT: "http://13.75.89.123:881/api/",
  ACCOUNT: {
    LOGIN: "Account/login",
    REFRESH_TOKEN: "Account/RefreshToken"
  },
  EMP_ASSESSMENT: {
    GET_QUESTIONS_WITH_ANSWERS: "EmployeeAssessment/GetQuestionWithAns/",
    SUBMIT: "EmployeeAssessment/InsertEmployeeAssessment"
  },
  ASSESSMENT: {
    GET_ALL: "Assessment/GetAllAssessments",
    GET_ONE: "Assessment/",
    CREATE: "Assessment/CreateAssessment",
    UPDATE: "Assessment/UpdateAssessment",
    GET_EMPLOYEE_STATUS: "Assessment/EmployeeAssessmentList_Get/"
  },
  EMPLOYEE: {
    GET_ALL: "Employees",
    GET_EMPLOYEE_ASSESSMENTS: "Employees/GetEmployeeAssessmentDetail/"
  },
  QUESTIONNAIRE: {
    GET_ALL: "Questionaire",
    GET_ONE: "Questionaire/",
    CREATE: "Questionaire",
    UPDATE: "Questionaire",
    GET_QUESTIONS: "Questionaire/QuestionairesWithQuestions/"
  },
  QUESTION: {
    INSERT_ARR: "Questions/InsertQuestions",
    UPDATE: "Questions/UpdateQuestions",
    REMOVE: "Questions/RemoveQuestion"
  },
  QUESTION_CATEGORY: {
    GET_ALL: "QuestionCategories"
  },
  OPTION_GROUP: {
    GET_ALL: "OptionGroups",
    GET_ALL_WITH_OPTIONS: "OptionGroups/OptionGroupWithOptions_GetAll"
  }
};

export const API_X = {
  END_POINT: "assets/test-data/",
  TEAM: {
    GET_ALL: "team-getAll.json",
    GET_MEMBERS: "team-members.json",
    GET_ASSESSMENTS: "team-assessments.json"
  },
  CLIENT: {
    GET_LIST: "client-list.json"
  },
  EMPLOYEE: {
    GET_LIST: "employee-list.json"
  },
  ROLE: {
    GET_LIST: "role-list.json"
  }
}
