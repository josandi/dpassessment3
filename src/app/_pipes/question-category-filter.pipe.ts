import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'questionCategoryFilter',
  pure: false
})
export class QuestionCategoryFilterPipe implements PipeTransform {

  transform(questions: any, filter: Object): any {
    if (!questions || !filter) {
      return false;
    }

    return questions.filter(question => question.questionCategoryId == filter );
  }

}
