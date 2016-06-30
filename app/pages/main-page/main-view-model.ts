import { Observable } from 'data/observable';
import { Session } from '../../shared/interfaces'
import { SessionViewModel } from '../session-page/session-view-model';
import { SessionsService } from '../../services/sessions-service';


export class MainViewModel extends Observable {
    private _allSessions: Array<SessionViewModel> = new Array<SessionViewModel>();
    private _sessions: Array<SessionViewModel>;
    private _sessionsService: SessionsService;
    
    constructor() {
        super();
        this._sessionsService = new SessionsService();
        this.set('isLoading', true);
    }
    
    get sessions(): Array<SessionViewModel> {
        return this._sessions;
    } 
    
    public init() {
       this._sessionsService.loadSessions<Array<Session>>()
           .then((result: Array<Session>)=>{
               this.pushSessions(result);
               this.onDataLoaded();
           });
    }
    
    private pushSessions(sessionsFromService: Array<Session>) {
        for (var i = 0; i < sessionsFromService.length; i++) {
            var newSession = new SessionViewModel(sessionsFromService[i]);
            this._allSessions.push(newSession);
        }
    }
    
    private onDataLoaded() {
        this.set('isLoading', false);
        this.filter();
    }
    
    private filter() {
        this._sessions = this._allSessions;
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "sessions", value: this._sessions });
    }
}