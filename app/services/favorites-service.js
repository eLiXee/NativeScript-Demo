"use strict";
var appSettingsModule = require('application-settings');
var FAVOURITES = 'FAVOURITES';
try {
    exports.favourites = JSON.parse(appSettingsModule.getString(FAVOURITES, '[]'));
}
catch (error) {
    console.log('Error while retrieveing favourites: ' + error);
    exports.favourites = new Array();
}
function findSessionIndexInFavourites(sessionId) {
    for (var i = 0; i < exports.favourites.length; i++) {
        if (exports.favourites[i].sessionId === sessionId) {
            return i;
        }
    }
    return -1;
}
exports.findSessionIndexInFavourites = findSessionIndexInFavourites;
function addToFavourites(session) {
    if (findSessionIndexInFavourites(session.id) >= 0) {
        // Sesson already added to favourites.
        return;
    }
    persistSessionToFavourites(session);
}
exports.addToFavourites = addToFavourites;
function removeFromFavourites(session) {
    var index = findSessionIndexInFavourites(session.id);
    if (index >= 0) {
        exports.favourites.splice(index, 1);
        updateFavourites();
    }
}
exports.removeFromFavourites = removeFromFavourites;
function persistSessionToFavourites(session) {
    exports.favourites.push({
        sessionId: session.id,
        calendarEventId: session.calendarEventId
    });
    updateFavourites();
}
function updateFavourites() {
    var newValue = JSON.stringify(exports.favourites);
    console.log('favourites: ' + newValue);
    appSettingsModule.setString(FAVOURITES, newValue);
}
//# sourceMappingURL=favorites-service.js.map