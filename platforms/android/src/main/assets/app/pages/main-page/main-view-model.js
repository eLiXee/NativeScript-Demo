"use strict";
var observable_1 = require('data/observable');
var session_view_model_1 = require('../session-page/session-view-model');
var sessions_service_1 = require('../../services/sessions-service');
var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel() {
        _super.call(this);
        this._allSessions = new Array();
        this._sessionsService = new sessions_service_1.SessionsService();
        this.set('isLoading', true);
    }
    Object.defineProperty(MainViewModel.prototype, "sessions", {
        get: function () {
            return this._sessions;
        },
        enumerable: true,
        configurable: true
    });
    MainViewModel.prototype.init = function () {
        var _this = this;
        this._sessionsService.loadSessions()
            .then(function (result) {
            _this.pushSessions(result);
            _this.onDataLoaded();
        });
    };
    MainViewModel.prototype.pushSessions = function (sessionsFromService) {
        for (var i = 0; i < sessionsFromService.length; i++) {
            var newSession = new session_view_model_1.SessionViewModel(sessionsFromService[i]);
            this._allSessions.push(newSession);
        }
    };
    MainViewModel.prototype.onDataLoaded = function () {
        this.set('isLoading', false);
        this.filter();
    };
    MainViewModel.prototype.filter = function () {
        this._sessions = this._allSessions;
        this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: "sessions", value: this._sessions });
    };
    return MainViewModel;
}(observable_1.Observable));
exports.MainViewModel = MainViewModel;
//# sourceMappingURL=main-view-model.js.map