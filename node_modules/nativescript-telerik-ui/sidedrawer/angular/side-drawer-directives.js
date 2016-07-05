var core_1 = require("@angular/core");
var sidedrawer_1 = require("./../sidedrawer");
var page_1 = require("ui/page");
var elementRegistry = require('nativescript-angular/element-registry');
var di_1 = require('@angular/core/src/di');
var RadSideDrawerComponent = (function () {
    function RadSideDrawerComponent(elementRef, page, viewContainer) {
        this.elementRef = elementRef;
        this.page = page;
        this.viewContainer = viewContainer;
        this.sideDrawerMovedToPage = false;
        this.drawerOpening = new core_1.EventEmitter();
        this.drawerOpen = new core_1.EventEmitter();
        this.drawerClosing = new core_1.EventEmitter();
        this.drawerClosed = new core_1.EventEmitter();
        this.sideDrawer = this.elementRef.nativeElement;
    }
    Object.defineProperty(RadSideDrawerComponent.prototype, "transition", {
        set: function (transition) {
            this.sideDrawer.drawerTransition = transition;
        },
        enumerable: true,
        configurable: true
    });
    RadSideDrawerComponent.prototype.moveFirstNonTextChild = function (childViewRef, afterMove) {
        var topLevelViews = childViewRef.rootNodes.filter(function (node) {
            return node.nodeName && node.nodeName !== '#text';
        });
        if (topLevelViews.length === 0) {
            return;
        }
        if (!this.sideDrawerMovedToPage) {
            if (this.sideDrawer.parent) {
                this.sideDrawer.parent._removeView(this.sideDrawer);
            }
            this.page.content = this.sideDrawer;
            this.sideDrawerMovedToPage = true;
        }
        var viewRoot = topLevelViews[0];
        if (viewRoot.parent) {
            viewRoot.parent._removeView(viewRoot);
        }
        afterMove(viewRoot);
    };
    RadSideDrawerComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        //Instantiate templates first, move content later.
        //Avoids visual tree attach issues since the Angular renderer needs to
        //create and attach the second template right after the first one.
        var mainViewRef = this.viewContainer.createEmbeddedView(this.mainTemplate);
        var drawerViewRef = this.viewContainer.createEmbeddedView(this.drawerTemplate);
        var mainViewRoot = this.moveFirstNonTextChild(mainViewRef, function (mainViewRoot) {
            _this.sideDrawer.mainContent = mainViewRoot;
        });
        var sideViewRoot = this.moveFirstNonTextChild(drawerViewRef, function (sideViewRoot) {
            _this.sideDrawer.drawerContent = sideViewRoot;
        });
    };
    Object.defineProperty(RadSideDrawerComponent.prototype, "drawerContentSize", {
        set: function (value) {
            this._drawerContentSize = value;
            this.updateContentSize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadSideDrawerComponent.prototype, "showOverNavigation", {
        set: function (value) {
            this._showOverNavigation = value;
            this.updateShowOverNavigation();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadSideDrawerComponent.prototype, "gesturesEnabled", {
        set: function (value) {
            this._gesturesEnabled = value;
            this.updateGesturesEnabled();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadSideDrawerComponent.prototype, "drawerTransition", {
        set: function (value) {
            this._drawerTransition = value;
            this.updateDrawerTransition();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadSideDrawerComponent.prototype, "drawerLocation", {
        set: function (value) {
            this._drawerLocation = value;
            this.updateDrawerLocation();
        },
        enumerable: true,
        configurable: true
    });
    RadSideDrawerComponent.prototype.updateDrawerLocation = function () {
        this.sideDrawer.drawerLocation = this._drawerLocation;
    };
    RadSideDrawerComponent.prototype.updateDrawerTransition = function () {
        this.sideDrawer.drawerTransition = this._drawerTransition;
    };
    RadSideDrawerComponent.prototype.updateGesturesEnabled = function () {
        this.sideDrawer.gesturedEnabled = this._gesturesEnabled;
    };
    RadSideDrawerComponent.prototype.updateShowOverNavigation = function () {
        this.sideDrawer.showOverNavigation = this._showOverNavigation;
    };
    RadSideDrawerComponent.prototype.updateContentSize = function () {
        this.sideDrawer.drawerContentSize = this._drawerContentSize;
    };
    __decorate([
        core_1.Output()
    ], RadSideDrawerComponent.prototype, "drawerOpening", void 0);
    __decorate([
        core_1.Output()
    ], RadSideDrawerComponent.prototype, "drawerOpen", void 0);
    __decorate([
        core_1.Output()
    ], RadSideDrawerComponent.prototype, "drawerClosing", void 0);
    __decorate([
        core_1.Output()
    ], RadSideDrawerComponent.prototype, "drawerClosed", void 0);
    __decorate([
        core_1.Input()
    ], RadSideDrawerComponent.prototype, "transition", null);
    RadSideDrawerComponent = __decorate([
        core_1.Component({
            selector: 'RadSideDrawer',
            template: ''
        }),
        __param(0, core_1.Inject(core_1.ElementRef)),
        __param(1, core_1.Inject(page_1.Page)),
        __param(2, core_1.Inject(core_1.ViewContainerRef))
    ], RadSideDrawerComponent);
    return RadSideDrawerComponent;
}());
exports.RadSideDrawerComponent = RadSideDrawerComponent;
var MainTemplateDirective = (function () {
    function MainTemplateDirective(owner, template) {
        owner.mainTemplate = template;
    }
    MainTemplateDirective = __decorate([
        core_1.Directive({
            selector: "[drawerMain]"
        }),
        __param(0, core_1.Inject(RadSideDrawerComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef))
    ], MainTemplateDirective);
    return MainTemplateDirective;
}());
exports.MainTemplateDirective = MainTemplateDirective;
var DrawerTemplateDirective = (function () {
    function DrawerTemplateDirective(owner, template) {
        owner.drawerTemplate = template;
    }
    DrawerTemplateDirective = __decorate([
        core_1.Directive({
            selector: "[drawerSide]"
        }),
        __param(0, core_1.Inject(RadSideDrawerComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef))
    ], DrawerTemplateDirective);
    return DrawerTemplateDirective;
}());
exports.DrawerTemplateDirective = DrawerTemplateDirective;
exports.SIDEDRAWER_DIRECTIVES = [RadSideDrawerComponent, MainTemplateDirective, DrawerTemplateDirective];
exports.SIDEDRAWER_PROVIDERS = [di_1.provide(core_1.PLATFORM_DIRECTIVES, { useValue: exports.SIDEDRAWER_DIRECTIVES, multi: true })];
elementRegistry.registerElement("RadSideDrawer", function () { return sidedrawer_1.RadSideDrawer; });
