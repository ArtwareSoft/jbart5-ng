import {jb} from 'jb-core';
import { NgModule }      from '@angular/core';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

jb.component('aot-test.main', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'label', title: 'aot title' }, 
      {$: 'label',
        title: 'aot test', 
        style :{$: 'label.aot-test' } // "label.aot-test"
      }
    ]
  }
})


jb.component('label.aot-test', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<span>{{title}}</span>',
        features :{$: 'label.bind-title' }
    }
})


