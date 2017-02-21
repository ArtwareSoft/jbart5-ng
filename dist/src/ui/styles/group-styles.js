jb.component('group.div', {
    type: 'group.style',
    impl: { $: 'customStyle',
        template: "<div *ngFor=\"let ctrl of ctrls\"><div *jbComp=\"ctrl\"></div></div>",
        features: { $: 'group.init-group' }
    }
});
jb.component('group.expandable', {
    type: 'group.style',
    impl: { $: 'customStyle',
        template: "<section class=\"jb-group\">\n       <div class=\"header\">\n        <div class=\"title\">{{title}}</div>\n        <button md-icon-button md-button (click)=\"toggle()\" title=\"{{expand_title()}}\">\n        <i *ngIf=\"show\" class=\"material-icons\">keyboard_arrow_down</i>\n        <i *ngIf=\"!show\" class=\"material-icons\">keyboard_arrow_right</i>\n        </button>\n      </div>\n      <template [ngIf]=\"show\">\n        <div *ngFor=\"let ctrl of ctrls\"><div *jbComp=\"ctrl\"></div></div>\n      </template>\n</section>",
        css: ".header { display: flex; flex-direction: row; }\n        button:hover { background: none }\n        button { margin-left: auto }\n        i { color: #}\n        .title { margin: 5px }",
        features: [
            { $: 'group.init-group' },
            { $: 'group.init-expandable' },
        ]
    },
});
jb.component('group.init-expandable', {
    type: 'feature',
    impl: function (ctx) { return ({
        init: function (cmp) {
            cmp.show = true;
            cmp.expand_title = function () { return cmp.show ? 'collapse' : 'expand'; };
            cmp.toggle = function () { cmp.show = !cmp.show; };
        },
    }); }
});
jb.component('group.accordion', {
    type: 'group.style',
    impl: { $: 'customStyle',
        template: "<section class=\"jb-group\">\n      <div *ngFor=\"let ctrl of ctrls\" class=\"accordion-section\">\n        <div class=\"header\">\n          <div class=\"title\">{{ctrl.title}}</div>\n          <button md-icon-button md-button (click)=\"toggle(ctrl)\" title=\"{{expand_title(ctrl)}}\">\n                <i *ngIf=\"ctrl.show\" class=\"material-icons\">keyboard_arrow_down</i>\n                <i *ngIf=\"!ctrl.show\" class=\"material-icons\">keyboard_arrow_right</i>\n          </button>\n        </div>\n      <template [ngIf]=\"ctrl.show\">\n        <div *jbComp=\"ctrl.comp\"></div>\n      </template>\n      </div>\n  </section>",
        css: ".header { display: flex; flex-direction: row; }\n        button:hover { background: none }\n        button { margin-left: auto }\n        i { color: #}\n        .title { margin: 5px }",
        features: [
            { $: 'group.init-group' },
            { $: 'group.init-accordion' },
        ]
    },
});
jb.component('group.init-accordion', {
    type: 'feature',
    impl: function (ctx) { return ({
        init: function (cmp) {
            cmp.expand_title = function (ctrl) {
                return ctrl.show ? 'collapse' : 'expand';
            };
            cmp.toggle = function (newCtrl) {
                return cmp.ctrls.forEach(function (ctrl) {
                    return ctrl.show = ctrl == newCtrl ? !ctrl.show : false;
                });
            };
        },
        afterViewInit: function (cmp) {
            if (cmp.ctrls && cmp.ctrls[0])
                cmp.ctrls[0].show = true;
        },
    }); }
});
jb.component('toolbar.simple', {
    type: 'group.style',
    impl: { $: 'customStyle',
        features: { $: 'group.init-group' },
        template: "<div class=\"toolbar\">\n        <div *ngComps=\"ctrls\"></div>\n      </div>",
        css: "{ \n            display: flex;\n            background: #F5F5F5; \n            height: 33px; \n            width: 100%;\n            border-bottom: 1px solid #D9D9D9; \n            border-top: 1px solid #fff;\n        }\n        * { margin-right: 0 }"
    }
});
