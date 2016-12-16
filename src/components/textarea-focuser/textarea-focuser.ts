import { Directive } from '@angular/core';

/*
  Generated class for the TextareaFocuser directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[textarea-focuser]' // Attribute selector
})
export class TextAreaFocuser {

  constructor() {
    console.log('Hello TextareaFocuser Directive');
  }

}
