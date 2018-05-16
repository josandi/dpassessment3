import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupedOptionFilter',
  pure: false
})
export class GroupedOptionFilterPipe implements PipeTransform {

  transform(optionGroups: any, filter: Object): any {
    if (!optionGroups || !filter) {
      return false;
    }

    return optionGroups.filter(optionGroup => optionGroup.optiongroup_id == filter );
  }

}
