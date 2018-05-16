import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optionGroupFilter',
  pure: false
})
export class OptionGroupFilterPipe implements PipeTransform {

  transform(options: any, filter: Object): any {
    if (!options || !filter) {
      return false;
    }

    return options.filter(option => option.optionGroupId == filter );
  }

}
