import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
// @Component({
//   selector: 'my-app',
//   template: '<h1>Hello Angular!{{text}}</h1>'
// })
// export class jBartStyle1 { }
export var jBartInnerStyle = (function () {
    function jBartInnerStyle() {
    }
    jBartInnerStyle.decorators = [
        { type: Component, args: [{
                    selector: 'jb-comp',
                    template: '<h1>aot test</h1>'
                },] },
    ];
    /** @nocollapse */
    jBartInnerStyle.ctorParameters = [];
    return jBartInnerStyle;
}());
export var jBartCompiledViewsModule = (function () {
    function jBartCompiledViewsModule() {
    }
    jBartCompiledViewsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    declarations: [jBartInnerStyle],
                },] },
    ];
    /** @nocollapse */
    jBartCompiledViewsModule.ctorParameters = [];
    return jBartCompiledViewsModule;
}());
//# sourceMappingURL=test-aot.js.map