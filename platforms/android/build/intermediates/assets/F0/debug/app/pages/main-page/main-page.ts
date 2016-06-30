import { EventData } from 'data/observable';
import { GestureEventData } from 'ui/gestures';
import { Page } from 'ui/page';

import { MainViewModel } from './main-view-model';
import { SessionViewModel } from '../session-page/session-view-model';

var vm = new MainViewModel();
var page: Page;

export function pageLoaded(args: EventData) {
    page = <Page>args.object;
    page.bindingContext = vm;
    vm.init();
}

export function toggleFavorite(args: GestureEventData) {
    var session = <SessionViewModel>args.view.bindingContext;
    session.toggleFavorite();
}