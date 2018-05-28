export interface Assessment {
  assessmentId: number;
  assessmentName: string;
  assessmentDescription: string;
  submissionDeadline: Date;
  questionaireId?: number;                // admin only
  createdDateTime?: Date;                 // admin only
  empAssessmentStatus?: string;           // user-specific
}