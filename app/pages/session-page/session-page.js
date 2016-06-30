"use strict";
var session_view_model_1 = require('../session-page/session-view-model');
//TODO: Remove later
var fakeDataServiceModule = require('../../services/fake-data-service');
var vm;
var page;
function pageNavigatingTo(args) {
    page = args.object;
    var firstSession = loadFirstSessionViaFaker();
    vm = new session_view_model_1.SessionViewModel(firstSession);
    page.bindingContext = vm;
}
exports.pageNavigatingTo = pageNavigatingTo;
function toggleFavorite(args) {
    vm.toggleFavorite();
}
exports.toggleFavorite = toggleFavorite;
function toggleDescription(args) {
    var btn = args.object;
    var txtDesc = page.getViewById('txtDescription');
    var scroll = page.getViewById('scroll');
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
exports.toggleDescription = toggleDescription;
function loadFirstSessionViaFaker() {
    var speakers = fakeDataServiceModule.generateSpeakers();
    var roomInfos = fakeDataServiceModule.generateRoomInfos();
    var sessions = fakeDataServiceModule.generateSessions(speakers, roomInfos);
    var nonBreakSessions = sessions.filter(function (s) {
        return !s.isBreak && s.speakers.length > 0;
    });
    return nonBreakSessions[0];
}
exports.loadFirstSessionViaFaker = loadFirstSessionViaFaker;
//# sourceMappingURL=session-page.js.map