jb.component('editable-boolean.checkbox', {
    type: 'editable-boolean.style',
    impl: { $: 'customStyle',
        features: { $: 'field.databind' },
        template: "<div><input type=\"checkbox\" [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.checked)\" (keyup)=\"jbModel($event.target.checked,'keyup')\"></div>",
    }
});
jb.component('editable-boolean.checkbox-with-title', {
    type: 'editable-boolean.style',
    impl: { $: 'customStyle',
        features: { $: 'field.databind' },
        template: "<div><input type=\"checkbox\" [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.checked)\" (keyup)=\"jbModel($event.target.checked,'keyup')\">{{text()}}</div>",
    }
});
jb.component('editable-boolean.flipswitch', {
    type: 'editable-boolean.style',
    impl: { $: 'customStyle',
        features: { $: 'field.databind' },
        template: "<div><input class=\"flipswitch\" type=\"checkbox\" [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.checked)\" (keyup)=\"jbModel($event.target.checked,'keyup')\"></div>",
        css: ".flipswitch\n{\n    position: relative;\n    background: white;\n    width: 80px;\n    height: 21px;\n    margin-left: 0;\n    border-radius: 5px;\n    -webkit-appearance: initial;\n    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n    outline:none;\n    font: 12px Arial;\n    cursor:pointer;\n    border:1px solid #ccc;\n}\n.flipswitch:after\n{\n    position:absolute;\n    top:5%;\n    display:block; \n    line-height:20px;\n    width:45%;\n    height:90%;\n    background:#fff;\n    box-sizing:border-box;\n    text-align:center;\n    transition: all 0.3s ease-in 0s; \n    color:black;\n    border:#eee 1px solid;\n    border-radius:3px;\n}\n.flipswitch:after\n{\n    left:2%;\n    content: \"No\";\n}\n.flipswitch:checked:after\n{\n    left:52%;\n    content: \"Yes\";  \n}\n      "
    }
});
jb.component('editable-boolean.expand-collapse', {
    type: 'editable-boolean.style',
    impl: { $: 'customStyle',
        features: { $: 'field.databind' },
        template: "<div><input type=\"checkbox\" [ngModel]=\"jbModel()\" (change)=\"jbModel($event.checked)\" (keyup)=\"jbModel($event.target.checked,'keyup')\">\n      \t<i class=\"material-icons noselect\" (click)=\"toggle()\">{{jbModel() ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>\n      </div>",
        css: "i { font-size:16px; cursor: pointer; }\n      \t\tinput { display: none }"
    }
});
