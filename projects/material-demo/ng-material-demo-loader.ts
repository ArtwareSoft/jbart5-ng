import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {Component,NgModule,Injectable} from '@angular/core';
import {ViewChildren,QueryList,ViewEncapsulation,ViewChild,ViewContainerRef} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button/button';
import {MdCardModule} from '@angular2-material/card/card';
import {MD_CHECKBOX_DIRECTIVES} from '@angular2-material/checkbox/checkbox';
import {MD_RADIO_DIRECTIVES} from '@angular2-material/radio/radio';
import {MdIcon} from '@angular2-material/icon/icon';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
//import {MdTooltip,TooltipComponent} from '@angular2-material/tooltip/tooltip';

import {MD_BUTTON_TOGGLE_DIRECTIVES} from '@angular2-material/button-toggle/button-toggle';
import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list/grid-list';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list/list';
import {MdRipple, MD_RIPPLE_DIRECTIVES} from '@angular2-material/core/ripple/ripple'; 

import {MD_PROGRESS_BAR_DIRECTIVES} from '@angular2-material/progress-bar/progress-bar'; 
import {MD_PROGRESS_CIRCLE_DIRECTIVES} from '@angular2-material/progress-circle/progress-circle'; 
import {MD_SLIDER_DIRECTIVES} from '@angular2-material/slider/slider';

import {MdLiveAnnouncer} from '@angular2-material/core/a11y/live-announcer';
import { Overlay, OverlayState,OverlayOrigin, OVERLAY_PROVIDERS, ComponentPortal, Portal,TemplatePortalDirective} from '@angular2-material/core/core';

import {
  MdUniqueSelectionDispatcher
} from '@angular2-material/core/coordination/unique-selection-dispatcher';


jb_ui.registerProviders({
  MdUniqueSelectionDispatcher: MdUniqueSelectionDispatcher,
  MdLiveAnnouncer: MdLiveAnnouncer,
  OVERLAY_PROVIDERS: OVERLAY_PROVIDERS,
});
jb_ui.registerDirectives({
  MD_CHECKBOX_DIRECTIVES: MD_CHECKBOX_DIRECTIVES, 
  MD_RADIO_DIRECTIVES:MD_RADIO_DIRECTIVES, 
  MD_BUTTON_TOGGLE_DIRECTIVES:MD_BUTTON_TOGGLE_DIRECTIVES,
  MD_GRID_LIST_DIRECTIVES: MD_GRID_LIST_DIRECTIVES,
  MD_LIST_DIRECTIVES: MD_LIST_DIRECTIVES,
  MD_RIPPLE_DIRECTIVES: MD_RIPPLE_DIRECTIVES,
  MD_PROGRESS_BAR_DIRECTIVES: MD_PROGRESS_BAR_DIRECTIVES,
  MD_PROGRESS_CIRCLE_DIRECTIVES: MD_PROGRESS_CIRCLE_DIRECTIVES,
  MD_SLIDER_DIRECTIVES: MD_SLIDER_DIRECTIVES,
//  MdTooltip: MdTooltip,
});

export class TooltipDemo {
  position: TooltipPosition = 'below';
}

export class ProgressCircleDemo {
  progressValue: number = 40;

  step(val: number) {
    this.progressValue += val;
  }
}

export class RippleDemo {
  @ViewChild(MdRipple) manualRipple: MdRipple;

  centered = false;
  disabled = false;
  unbounded = false;
  rounded = false;
  maxRadius: number = null;
  rippleSpeed = 1;
  rippleColor = '';
  rippleBackgroundColor = '';

  disableButtonRipples = false;

  doManualRipple() {
    if (this.manualRipple) {
      window.setTimeout(() => this.manualRipple.start(), 10);
      window.setTimeout(() => this.manualRipple.end(0, 0), 500);
    }
  }
}

export class GesturesDemo {
  dragCount: number = 0;
  panCount: number = 0;
  pressCount: number = 0;
  longpressCount: number = 0;
  swipeCount: number = 0;
  slideCount: number = 0;
}

export class GridlistDemo {
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

export class CheckboxDemo {
  isIndeterminate: boolean = false;
  isChecked: boolean = false;
  isDisabled: boolean = false;
  alignment: string = 'start';

  printResult() {
    if (this.isIndeterminate) {
      return 'Maybe!';
    }
    return this.isChecked ? 'Yes!' : 'No!';
  }
}

export class ButtonDemo {
  isDisabled: boolean = false;
  clickCounter: number = 0;
}

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

export class ListDemo {
  items: string[] = [
    'Pepper',
    'Salt',
    'Paprika'
  ];

  contacts: any[] = [
    {name: 'Nancy', headline: 'Software engineer'},
    {name: 'Mary', headline: 'TPM'},
    {name: 'Bobby', headline: 'UX designer'}
  ];

  messages: any[] = [
    {
      from: 'Nancy',
      subject: 'Brunch?',
      message: 'Did you want to go on Sunday? I was thinking that might work.',
      image: 'https://angular.io/resources/images/bios/julie-ralph.jpg'
    },
    {
      from: 'Mary',
      subject: 'Summer BBQ',
      message: 'Wish I could come, but I have some prior obligations.',
      image: 'https://angular.io/resources/images/bios/juleskremer.jpg'
    },
    {
      from: 'Bobby',
      subject: 'Oui oui',
      message: 'Do you have Paris reservations for the 15th? I just booked!',
      image: 'https://angular.io/resources/images/bios/jelbourn.jpg'
    }
  ];

  links: any[] = [
    {name: 'Inbox'},
    {name: 'Outbox'},
    {name: 'Spam'},
    {name: 'Trash'}

  ];

  thirdLine: boolean = false;
  infoClicked: boolean = false;
}

@Injectable({
//  providers: [MdLiveAnnouncer]
})
export class LiveAnnouncerDemo {
  constructor(private live: MdLiveAnnouncer) {
  }

  announceText(message: string) {
    this.live.announce(message);
  }
}

jb_ui.registerProviders({
  LiveAnnouncerDemo: LiveAnnouncerDemo,
});

export class ProgressBarDemo {
  determinateProgressValue: number = 30;
  bufferProgressValue: number = 30;
  bufferBufferValue: number = 40;

  stepDeterminateProgressVal(val: number) {
    this.determinateProgressValue += val;
  }

  stepBufferProgressVal(val: number) {
    this.bufferProgressValue += val;
  }

  stepBufferBufferVal(val: number) {
    this.bufferBufferValue += val;
  }
}
