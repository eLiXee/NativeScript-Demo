import { FavouriteSession } from '../shared/interfaces';
import { SessionViewModel } from '../pages/session-page/session-view-model';
import * as appSettingsModule from 'application-settings';

var FAVOURITES = 'FAVOURITES';

export var favourites: Array<FavouriteSession>;

try {
    favourites = <Array<FavouriteSession>>JSON.parse(appSettingsModule.getString(FAVOURITES, '[]'));
}
catch (error) {
    console.log('Error while retrieveing favourites: ' + error);
    favourites = new Array<FavouriteSession>();
}

export function findSessionIndexInFavourites(sessionId: string): number {
    for (var i = 0; i < favourites.length; i++) {
        if (favourites[i].sessionId === sessionId) {
            return i;
        }
    }
    return -1;
}

export function addToFavourites(session: SessionViewModel) {
    if (findSessionIndexInFavourites(session.id) >= 0) {
        // Sesson already added to favourites.
        return;
    }
    persistSessionToFavourites(session);
}

export function removeFromFavourites(session: SessionViewModel) {
    var index = findSessionIndexInFavourites(session.id);
    if (index >= 0) {
        favourites.splice(index, 1);
        updateFavourites();
    }
}

function persistSessionToFavourites(session: SessionViewModel) {
    favourites.push({
        sessionId: session.id,
        calendarEventId: session.calendarEventId
    });
    updateFavourites();
}

function updateFavourites() {
    var newValue = JSON.stringify(favourites);
    console.log('favourites: ' + newValue);
    appSettingsModule.setString(FAVOURITES, newValue);
}