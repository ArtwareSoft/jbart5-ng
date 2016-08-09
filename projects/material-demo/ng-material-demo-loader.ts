import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {Component,NgModule} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button/button';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';
import {MD_CHECKBOX_DIRECTIVES} from '@angular2-material/checkbox/checkbox';
import {MD_RADIO_DIRECTIVES} from '@angular2-material/radio/radio';
import {MdIcon} from '@angular2-material/icon/icon';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';

import {MD_BUTTON_TOGGLE_DIRECTIVES} from '@angular2-material/button-toggle/button-toggle';
import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list/grid-list';

import {
  MdUniqueSelectionDispatcher
} from '@angular2-material/core/coordination/unique-selection-dispatcher';


jb_ui.registerProviders({
  MdUniqueSelectionDispatcher: MdUniqueSelectionDispatcher,
});
jb_ui.registerDirectives({
  MD_CHECKBOX_DIRECTIVES: MD_CHECKBOX_DIRECTIVES, 
  MD_RADIO_DIRECTIVES:MD_RADIO_DIRECTIVES, 
  MD_BUTTON_TOGGLE_DIRECTIVES:MD_BUTTON_TOGGLE_DIRECTIVES,
  MD_GRID_LIST_DIRECTIVES: MD_GRID_LIST_DIRECTIVES
});

export class GesturesDemo {
  dragCount: number = 0;
  panCount: number = 0;
  pressCount: number = 0;
  longpressCount: number = 0;
  swipeCount: number = 0;
  slideCount: number = 0;
}

export class GridListDemo {
  tiles: any[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  dogs: Object[] = [
    { name: 'Porter', human: 'Kara' },
    { name: 'Mal', human: 'Jeremy' },
    { name: 'Koby', human: 'Igor' },
    { name: 'Razzle', human: 'Ward' },
    { name: 'Molly', human: 'Rob' },
    { name: 'Husi', human: 'Matias' },
  ];

  fixedCols: number = 4;
  fixedRowHeight: number = 100;
  ratioGutter: number = 1;
  fitListHeight: string = '400px';
  ratio: string = '4:1';

  addTileCols() { this.tiles[2].cols++; }
}

var max = 0;
export class InputDemo {
  dividerColor: boolean;
  requiredField: boolean;
  floatingLabel: boolean;
  name: string;
  items: any[] = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
    { value: 50 },
  ];

  addABunch(n: number) {
    for (let x = 0; x < n; x++) {
      this.items.push({ value: ++max });
    }
  }
}