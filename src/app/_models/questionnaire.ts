export interface QuestionnaireListData {
  questionnaire_id: number;
  description: string;
  questions_count: number;
}

export interface QuestionnaireCategoryData {
  category_id: number;
  category: string;
}

export interface OptionsGroupData {
  optiongroup_id: number;
  description: string;
}

export interface QuestionnaireData {
  questions: [
    {
      question_id: number;
      question: string;
      category_id: number;
      category_name: string;
      options: [
        {
          option_id: number;
          option_value: number;
          option_text: string;
        }
      ]
    }
  ]
}