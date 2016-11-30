import { NgModule }      from '@angular/core';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// @Component({
//   selector: 'my-app',
//   template: '<h1>Hello Angular!{{text}}</h1>'
// })
// export class jBartStyle1 { }

@Component({
  selector: 'jb-comp',
  template: '<h1>aot test</h1>'
})
export class jBartInnerStyle { }


@NgModule({
  imports:      [ ],
  declarations: [ jBartInnerStyle ],
//  bootstrap:    [ jBartStyle1 ]
})
export class jBartCompiledViewsModule { }
