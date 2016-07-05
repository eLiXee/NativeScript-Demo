var core_1 = require('@angular/core');
var collection_1 = require('@angular/common/src/facade/collection');
var elementRegistry = require('nativescript-angular/element-registry');
var _1 = require('./../');
var layout_base_1 = require('ui/layouts/layout-base');
var observable_array_1 = require('data/observable-array');
var di_1 = require('@angular/core/src/di');
var ListItemContext = (function (_super) {
    __extends(ListItemContext, _super);
    function ListItemContext($implicit, item, index, even, odd) {
        _super.call(this, item);
        this.$implicit = $implicit;
        this.item = item;
        this.index = index;
        this.even = even;
        this.odd = odd;
    }
    return ListItemContext;
}(core_1.ElementRef));
exports.ListItemContext = ListItemContext;
var RadListViewComponent = (function () {
    function RadListViewComponent(_elementRef, _iterableDiffers, _cdr, loader) {
        var _this = this;
        this._elementRef = _elementRef;
        this._iterableDiffers = _iterableDiffers;
        this._cdr = _cdr;
        this.loader = loader;
        this._itemReordering = false;
        this.doCheckDelay = 5;
        this.setupItemView = new core_1.EventEmitter();
        this._nativeList = _elementRef.nativeElement;
        this._nativeList.listViewLayout = new _1.ListViewLinearLayout();
        var component = this;
        this._nativeList.itemViewLoader = function (viewType) {
            switch (viewType) {
                case _1.ListViewViewTypes.ItemView:
                    if (component._itemTemplate && _this.loader) {
                        var nativeItem = _this.loader.createEmbeddedView(component._itemTemplate, new ListItemContext(), 0);
                        var typedView = getSingleViewFromViewRef(nativeItem);
                        typedView["ng_view"] = nativeItem;
                        return typedView;
                    }
                    break;
                case _1.ListViewViewTypes.ItemSwipeView:
                    if (component._itemSwipeTemplate && _this.loader) {
                        var nativeItem = _this.loader.createEmbeddedView(component._itemSwipeTemplate, new ListItemContext(), 0);
                        var typedView = getSingleViewFromViewRef(nativeItem);
                        typedView["ng_view"] = nativeItem;
                        return typedView;
                    }
                    break;
                case _1.ListViewViewTypes.LoadOnDemandView:
                    if (component._loadOnDemandTemplate && _this.loader) {
                        var viewRef = _this.loader.createEmbeddedView(component._loadOnDemandTemplate, new ListItemContext(), 0);
                        var nativeView = getSingleViewFromViewRef(viewRef);
                        nativeView["ng_view"] = viewRef;
                        return nativeView;
                    }
                    break;
                case _1.ListViewViewTypes.HeaderView:
                    if (component._headerTemplate && _this.loader) {
                        var viewRef = _this.loader.createEmbeddedView(component._headerTemplate, new ListItemContext(), 0);
                        var nativeView = getSingleViewFromViewRef(viewRef);
                        nativeView["ng_view"] = viewRef;
                        return nativeView;
                    }
                    break;
                case _1.ListViewViewTypes.FooterView:
                    if (component._footerTemplate && _this.loader) {
                        var viewRef = _this.loader.createEmbeddedView(component._footerTemplate, new ListItemContext(), 0);
                        var nativeView = getSingleViewFromViewRef(viewRef);
                        nativeView["ng_view"] = viewRef;
                        return nativeView;
                    }
                    break;
            }
        };
    }
    Object.defineProperty(RadListViewComponent.prototype, "loadOnDemandTemplate", {
        set: function (value) {
            this._loadOnDemandTemplate = value;
            this._nativeList.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "headerTemplate", {
        set: function (value) {
            this._headerTemplate = value;
            if (this._nativeList.ios) {
                this._nativeList._updateHeaderFooterAvailability();
            }
            else if (this._nativeList.android) {
                this._nativeList._updateHeaderFooter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "footerTemplate", {
        set: function (value) {
            this._footerTemplate = value;
            if (this._nativeList.ios) {
                this._nativeList._updateHeaderFooterAvailability();
            }
            else if (this._nativeList.android) {
                this._nativeList._updateHeaderFooter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "itemTemplate", {
        set: function (value) {
            this._itemTemplate = value;
            this._nativeList.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "itemSwipeTemplate", {
        set: function (value) {
            this._itemSwipeTemplate = value;
            this._nativeList.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadListViewComponent.prototype, "items", {
        set: function (value) {
            this._items = value;
            var needDiffer = true;
            if (value instanceof observable_array_1.ObservableArray) {
                needDiffer = false;
            }
            if (needDiffer && !this._differ && collection_1.isListLikeIterable(value)) {
                this._differ = this._iterableDiffers.find(this._items).create(this._cdr, function (index, item) { return item; });
            }
            this._nativeList.items = this._items;
        },
        enumerable: true,
        configurable: true
    });
    RadListViewComponent.prototype.ngDoCheck = function () {
        var _this = this;
        if (this._itemReordering === true) {
            return;
        }
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(function () {
            clearTimeout(_this.timerId);
            if (_this._differ) {
                var changes = _this._differ.diff(_this._items);
                if (changes) {
                    _this._nativeList.refresh();
                }
            }
        }, this.doCheckDelay);
    };
    RadListViewComponent.prototype.onItemLoading = function (args) {
        var index = args.itemIndex;
        var currentItem = this.getDataItem(index);
        var ngView = args.view["ng_view"];
        if (ngView) {
            this.setupViewRef(ngView, currentItem, index);
        }
    };
    RadListViewComponent.prototype.setupViewRef = function (viewRef, data, index) {
        var context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 == 0);
        context.odd = !context.even;
        this.setupItemView.next({ view: viewRef, data: data, index: index, context: context });
    };
    RadListViewComponent.prototype.getDataItem = function (index) {
        return typeof (this._items.getItem) === "function" ? this._items.getItem(index) : this._items[index];
    };
    __decorate([
        core_1.Output()
    ], RadListViewComponent.prototype, "setupItemView", void 0);
    __decorate([
        core_1.HostListener("itemLoading", ['$event'])
    ], RadListViewComponent.prototype, "onItemLoading", null);
    RadListViewComponent = __decorate([
        core_1.Component({
            selector: "RadListView",
            template: "",
            inputs: ['items']
        }),
        __param(0, core_1.Inject(core_1.ElementRef)),
        __param(1, core_1.Inject(core_1.IterableDiffers)),
        __param(2, core_1.Inject(core_1.ChangeDetectorRef)),
        __param(3, core_1.Inject(core_1.ViewContainerRef))
    ], RadListViewComponent);
    return RadListViewComponent;
}());
exports.RadListViewComponent = RadListViewComponent;
var ListViewHeaderDirective = (function () {
    function ListViewHeaderDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    ListViewHeaderDirective.prototype.ngOnInit = function () {
        this.owner.headerTemplate = this.template;
    };
    ListViewHeaderDirective = __decorate([
        core_1.Directive({
            selector: "[listViewHeader]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef))
    ], ListViewHeaderDirective);
    return ListViewHeaderDirective;
}());
exports.ListViewHeaderDirective = ListViewHeaderDirective;
var ListViewFooterDirective = (function () {
    function ListViewFooterDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    ListViewFooterDirective.prototype.ngOnInit = function () {
        this.owner.footerTemplate = this.template;
    };
    ListViewFooterDirective = __decorate([
        core_1.Directive({
            selector: "[listViewFooter]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef))
    ], ListViewFooterDirective);
    return ListViewFooterDirective;
}());
exports.ListViewFooterDirective = ListViewFooterDirective;
var ListViewItemSwipeDirective = (function () {
    function ListViewItemSwipeDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    ListViewItemSwipeDirective.prototype.ngOnInit = function () {
        this.owner.itemSwipeTemplate = this.template;
    };
    ListViewItemSwipeDirective = __decorate([
        core_1.Directive({
            selector: "[listItemSwipeTemplate]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef))
    ], ListViewItemSwipeDirective);
    return ListViewItemSwipeDirective;
}());
exports.ListViewItemSwipeDirective = ListViewItemSwipeDirective;
var ListViewItemDirective = (function () {
    function ListViewItemDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    ListViewItemDirective.prototype.ngOnInit = function () {
        this.owner.itemTemplate = this.template;
    };
    ListViewItemDirective = __decorate([
        core_1.Directive({
            selector: "[listItemTemplate]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef))
    ], ListViewItemDirective);
    return ListViewItemDirective;
}());
exports.ListViewItemDirective = ListViewItemDirective;
var ListViewLoadOnDemandDirective = (function () {
    function ListViewLoadOnDemandDirective(owner, template) {
        this.owner = owner;
        this.template = template;
    }
    ListViewLoadOnDemandDirective.prototype.ngOnInit = function () {
        this.owner.loadOnDemandTemplate = this.template;
    };
    ListViewLoadOnDemandDirective = __decorate([
        core_1.Directive({
            selector: "[listLoadOnDemandTemplate]"
        }),
        __param(0, core_1.Inject(RadListViewComponent)),
        __param(1, core_1.Inject(core_1.TemplateRef))
    ], ListViewLoadOnDemandDirective);
    return ListViewLoadOnDemandDirective;
}());
exports.ListViewLoadOnDemandDirective = ListViewLoadOnDemandDirective;
function getSingleViewFromViewRef(viewRef) {
    var getSingleViewRecursive = function (nodes, nestLevel) {
        var actualNodes = nodes.filter(function (n) { return !!n && n.nodeName !== "#text"; });
        if (actualNodes.length === 0) {
            throw new Error("No suitable views found in list template! Nesting level: " + nestLevel);
        }
        else if (actualNodes.length > 1) {
            throw new Error("More than one view found in list template! Nesting level: " + nestLevel);
        }
        else {
            if (actualNodes[0]) {
                var parentLayout = actualNodes[0].parent;
                if (parentLayout instanceof layout_base_1.LayoutBase) {
                    parentLayout.removeChild(actualNodes[0]);
                }
                return actualNodes[0];
            }
            else {
                return getSingleViewRecursive(actualNodes[0].children, nestLevel + 1);
            }
        }
    };
    return getSingleViewRecursive(viewRef.rootNodes, 0);
}
exports.LISTVIEW_DIRECTIVES = [RadListViewComponent, ListViewItemDirective, ListViewItemSwipeDirective, ListViewHeaderDirective, ListViewFooterDirective, ListViewLoadOnDemandDirective];
exports.LISTVIEW_PROVIDERS = [di_1.provide(core_1.PLATFORM_DIRECTIVES, { useValue: exports.LISTVIEW_DIRECTIVES, multi: true })];
elementRegistry.registerElement("RadListView", function () { return _1.RadListView; });
