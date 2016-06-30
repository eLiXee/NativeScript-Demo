"use strict";
function onTap(args) {
    var button = args.object;
    button.text = "I was tapped";
    console.log('button was tapped');
}
exports.onTap = onTap;
//# sourceMappingURL=main-page.js.map