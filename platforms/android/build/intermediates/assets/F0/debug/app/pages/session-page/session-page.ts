import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { Button } from 'ui/button';
import { Label } from 'ui/label';
import { ScrollView } from 'ui/scroll-view';
import { SessionViewModel } from '../session-page/session-view-model';

//TODO: Remove later
import * as fakeDataServiceModule from '../../services/fake-data-service';

var vm: SessionViewModel;
var page: Page;

export function pageNavigatingTo(args) {
    page = <Page>args.object;
    var firstSession = loadFirstSessionViaFaker();
    vm = new SessionViewModel(firstSession);
    page.bindingContext = vm;
}

export function toggleFavorite(args) {
    vm.toggleFavorite();
}

export function toggleDescription(args: EventData) {
    var btn = <Button>args.object;
    var txtDesc = <Label>page.getViewById('txtDescription');
    var scroll = <ScrollView>page.getViewById('scroll');

    if (btn.text === 'MORE') {
        btn.text = 'LESS';
        txtDesc.text = vm.description;
    }
    else {
        btn.text = 'MORE';
        txtDesc.text = vm.descriptionShort;
        scroll.scrollToVerticalOffset(0, false);
    }
}

export function loadFirstSessionViaFaker<T>() {
    let speakers = fakeDataServiceModule.generateSpeakers();
    let roomInfos = fakeDataServiceModule.generateRoomInfos();
    let sessions = <any>fakeDataServiceModule.generateSessions(speakers, roomInfos);
    var nonBreakSessions = sessions.filter(s => {
        return !s.isBreak && s.speakers.length > 0;
    });
    return nonBreakSessions[0];
}