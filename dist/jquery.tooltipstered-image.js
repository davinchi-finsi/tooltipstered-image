/**
 * jqQuiz plugin v0.1.4
 * https://github.com/davinchi-finsi/jq-quiz
 * 
 * Copyright Davinchi and other contributors
 * Released under the MIT license
 * https://github.com/davinchi-finsi/jq-quiz/blob/master/LICENSE
 * 
 * Build: 31/03/2020 10:16
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'jquery', 'svg.js', 'jquery-ui', 'tooltipster'], factory);
    }
    else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        factory(exports, require('jquery'), require('svg.js'), require('jquery-ui'), require('tooltipster'));
    }
    else {
        factory((root.jqTooltipsteredImage = {}), root.$, root.SVG);
    }
}(this, function (exports, $, SVG) {
    $.widget("jqtlpi.tooltipsteredImageStep", {
        ON_COMPLETED: "tooltipsteredImageStep:completed",
        STATES: {
            waiting: 0,
            current: 1,
            active: 2,
            completed: 3,
            open: 4
        },
        options: {
            classes: {
                main: "tooltipstered-image__step",
                waiting: "tooltipstered-image__step--waiting",
                current: "tooltipstered-image__step--current",
                active: "tooltipstered-image__step--active",
                completed: "tooltipstered-image__step--completed",
                disabled: "tooltipstered-image__step--disabled",
                open: "tooltipstered-image__step--open"
            },
            tooltip: {},
            enableTooltip: null,
            disableTooltip: null,
            processTitle: null,
            processTemplate: null,
            destroyTooltip: null,
            registerTooltipEvents: null,
            initTooltip: null
        },
        _create: function () {
            this.refresh();
            this.element.addClass(this.options.classes.main);
            this._registerTooltipEvents();
        },
        _setStateWaiting: function () {
            this._currentState = this.STATES.waiting;
            this.element.removeClass(this.options.classes.current);
            this.element.removeClass(this.options.classes.active);
            this.element.addClass(this.options.classes.waiting);
            this._disableTooltip();
        },
        _setStateCurrent: function () {
            if (this._currentState === this.STATES.waiting) {
                this._currentState = this.STATES.current;
                this.element.removeClass(this.options.classes.waiting);
                this.element.addClass(this.options.classes.current);
                this._enableTooltip();
            }
        },
        _setStateActive: function () {
            if (this._currentState === this.STATES.current) {
                this._currentState = this.STATES.active;
                this.element.removeClass(this.options.classes.current);
                this.element.addClass(this.options.classes.active);
            }
        },
        _setStateCompleted: function () {
            if (this._currentState === this.STATES.active) {
                this._currentState = this.STATES.completed;
                this.element.removeClass(this.options.classes.active);
                this.element.addClass(this.options.classes.completed);
            }
        },
        _setState: function (state) {
            switch (state) {
                case this.STATES.waiting:
                    this._setStateWaiting();
                    break;
                case this.STATES.current:
                    this._setStateCurrent();
                    break;
                case this.STATES.active:
                    this._setStateActive();
                    break;
                case this.STATES.completed:
                    this._setStateCompleted();
                    break;
            }
        },
        refresh: function () {
            this._destroyTooltip();
            this._processTitle();
            this._processTemplate();
            this._initTooltip(this.options.tooltip);
            this._setState(this.STATES.waiting);
        },
        run: function () {
            this._setState(this.STATES.current);
        },
        reset: function () {
            this._setState(this.STATES.waiting);
        },
        _processTitle: function () {
            if ((typeof this.options.processTitle).toLowerCase() == "function") {
                this.options.processTitle.call(this);
            }
            else {
                if (this.options.title != undefined) {
                    this.element.attr("title", this.options.title);
                }
            }
        },
        _processTemplate: function () {
            if ((typeof this.options.processTemplate).toLowerCase() == "function") {
                if (this.options.template != undefined) {
                    this.options.processTemplate.call(this, this.options.template);
                }
            }
            else {
                if (this.options.template != undefined) {
                    this.element.attr("data-tooltip-content", this.options.template);
                }
            }
        },
        _destroyTooltip: function () {
            if ((typeof this.options.destroyTooltip).toLowerCase() == "function") {
                this.options.destroyTooltip.call(this);
            }
            else {
                if (this.element.data("tooltipsterNs")) {
                    var tooltip = this.element.data(this.element.data("tooltipsterNs")[0]);
                    tooltip.destroy();
                }
            }
        },
        _initTooltip: function (options) {
            if ((typeof this.options.initTooltip).toLowerCase() == "function") {
                if ((typeof this.options.registerTooltipEvents).toLowerCase() == "function") {
                    if ((typeof this.options.enableTooltip).toLowerCase() == "function") {
                        if ((typeof this.options.disableTooltip).toLowerCase() == "function") {
                            this.options.initTooltip.call(this, options);
                        }
                        else {
                            throw "TooltipsteredImageStepError: If initTooltip option is provided, disableTooltip must be provided as well";
                        }
                    }
                    else {
                        throw "TooltipsteredImageStepError: If initTooltip option is provided, enableTooltip must be provided as well";
                    }
                }
                else {
                    throw "TooltipsteredImageStepError: If initTooltip option is provided, registerTooltipEvents must be provided as well";
                }
            }
            else {
                this.element.tooltipster(options);
            }
        },
        _registerTooltipEvents: function () {
            if ((typeof this.options.registerTooltipEvents).toLowerCase() == "function") {
                this.options.registerTooltipEvents.call(this, this._onTooltipOpening.bind(this), this._onTooltipClose.bind(this));
            }
            else {
                var tooltip = this.element.data(this.element.data("tooltipsterNs")[0]);
                tooltip.on("state", this._onTooltipsterStateChange.bind(this));
            }
        },
        _onTooltipsterStateChange: function (e) {
            if (e.state == "appearing") {
                this._onTooltipOpening();
            }
            else if (e.state == "closed") {
                this._onTooltipClose();
            }
        },
        _enableTooltip: function () {
            if ((typeof this.options.enableTooltip).toLowerCase() == "function") {
                this.options.enableTooltip.call(this);
            }
            else {
                this.element.tooltipster("enable");
            }
        },
        _disableTooltip: function () {
            if ((typeof this.options.disableTooltip).toLowerCase() == "function") {
                this.options.disableTooltip.call(this);
            }
            else {
                this.element.tooltipster("disable");
            }
        },
        _onTooltipOpening: function () {
            if (this.options.disabled != true) {
                this._setState(this.STATES.active);
                this.element.addClass(this.options.classes.open);
            }
        },
        _onTooltipClose: function () {
            if (this.options.disabled != true) {
                this.element.removeClass(this.options.classes.open);
                if (this._currentState != this.STATES.completed) {
                    this._setState(this.STATES.completed);
                    this.element.trigger(this.ON_COMPLETED);
                }
            }
        },
        enable: function () {
            this.options.disabled = false;
            this.element.removeClass(this.options.classes.disabled);
            if (this._currentState != this.STATES.waiting) {
                this._enableTooltip();
            }
        },
        disable: function () {
            this.options.disabled = true;
            this.element.addClass(this.options.classes.disabled);
            this._disableTooltip();
        }
    });
    $.widget("ui.tooltipsteredImage", {
        ON_COMPLETED: "tooltipsteredImage:completed",
        options: {
            classes: {
                main: "tooltipstered-image",
                waiting: "tooltipstered-image--running",
                completed: "tooltipstered-image--completed"
            },
            svgUrl: "",
            svgAttr: {
                preserveAspectRatio: "xMidYMid meet"
            },
            autoRun: true,
            autoStop: false,
            initialized: null
        },
        _create: function () {
            this._completed = 0;
            this.element.addClass(this.options.classes.main);
            this.refresh();
        },
        refresh: function () {
            this._clear();
            this._initSvg();
        },
        _clear: function () {
            if (this._svgContext) {
                this.element.find("#" + this._svgContext.id()).remove();
            }
        },
        _applySvgAttrs: function (attrs) {
            if (this._svgContext) {
                this._svgContext.attr(attrs);
            }
        },
        _applySvgViewbox: function (config) {
            if (this._svgContext) {
                if (Array.isArray(config)) {
                    this._svgContext.viewbox.apply(this._svgContext, config);
                }
                else {
                    this._svgContext.viewbox(config);
                }
            }
        },
        _initSvg: function () {
            var defer = $.Deferred();
            this._svgContext = SVG(this.element.get(0)).size("100%", "100%");
            if (this.options.viewbox) {
                this._applySvgViewbox(this.options.viewbox);
            }
            if (this.options.svgAttr) {
                this._applySvgAttrs(this.options.svgAttr);
            }
            var promise = this._loadSvgFile();
            promise.then(this._onProcessedSvgFile.bind(this, defer));
            return defer.promise();
        },
        _onProcessedSvgFile: function (defer, svgString) {
            this._svgContext.svg(svgString);
            this._processSvgElements();
            if ((typeof this.options.initialized).toLowerCase() == "function") {
                this.options.initialized(this);
            }
            if (this.options.autoRun == true) {
                this.run();
            }
            defer.resolve();
        },
        _processSvgFile: function (documentElement) {
            if (documentElement) {
                var result = void 0;
                if (documentElement.innerHTML) {
                    result = documentElement.innerHTML;
                }
                else {
                    result = new XMLSerializer().serializeToString(documentElement).replace(/^<svg[^>]*>/, "").replace(/<\/svg>/, "");
                }
                return result;
            }
            else {
                throw "[ERROR] TooltipsteredImageError: The requested file is not valid:" + this.options.svgUrl;
            }
        },
        _onGetSvgFileSuccess: function (result) {
            var jqAjaxObject = this, instance = jqAjaxObject._data.context, defer = jqAjaxObject._data.defer, svgString = instance._processSvgFile(result.documentElement);
            defer.resolveWith(instance, [svgString]);
        },
        _onGetSvgFileFail: function (error) {
            console.error("[Error] TooltipsteredImageError: The svg file could not be loaded");
            throw error;
        },
        _loadSvgFile: function () {
            var defer = $.Deferred();
            if (!!this.options.svgUrl) {
                $.ajax({
                    method: "GET",
                    type: "document",
                    url: this.options.svgUrl,
                    _data: {
                        context: this,
                        defer: defer
                    }
                }).then(this._onGetSvgFileSuccess, this._onGetSvgFileFail);
            }
            else {
                console.error("[ERROR] TooltipsteredImageError: The svgUrl option is obligatory");
                defer.reject();
            }
            return defer.promise();
        },
        _processSvgElement: function (item) {
            var svgElement = SVG.get(item.id);
            if (svgElement != undefined) {
                $(svgElement.node).tooltipsteredImageStep($.extend({
                    svg: svgElement
                }, item));
                var $svg = $(svgElement.node), instance = $svg.tooltipsteredImageStep("instance"), processed = {
                    $svg: $svg,
                    stepInstance: instance,
                    svg: svgElement,
                    options: item
                };
                $svg.off("tooltipsteredImageStep:completed");
                $svg.on("tooltipsteredImageStep:completed", { instance: this }, this._onStepCompleted);
                return processed;
            }
        },
        _processSvgElements: function () {
            if (this._svgContext) {
                this._steps = [];
                var items = this.options.items;
                for (var itemIndex = 0, itemsLength = items.length; itemIndex < itemsLength; itemIndex++) {
                    var currentItem = items[itemIndex], step = this._processSvgElement(currentItem);
                    if (step != undefined) {
                        this._steps.push(step);
                    }
                }
            }
        },
        _onStepCompleted: function (e) {
            var instance = e.data.instance;
            instance._completed++;
            if (!instance._checkCompleted()) {
                instance._runNextStep();
            }
        },
        _runNextStep: function () {
            if (this.options.sequential === true) {
                this._steps[this._completed].stepInstance.run();
            }
        },
        _checkCompleted: function () {
            var result = false;
            if (this._completed == this._steps.length) {
                result = true;
                if (this.options.autoStop == true) {
                    this.stop();
                }
                this.element.addClass(this.options.classes.completed);
                this.element.trigger(this.ON_COMPLETED);
            }
            return result;
        },
        stop: function () {
            if (this._running) {
                this._running = false;
                for (var _i = 0, _a = this._steps; _i < _a.length; _i++) {
                    var step = _a[_i];
                    step.stepInstance.disable();
                }
                this.element.removeClass(this.options.classes.running);
            }
        },
        reset: function () {
            if (!this._running) {
                this._completed = 0;
                for (var _i = 0, _a = this._steps; _i < _a.length; _i++) {
                    var step = _a[_i];
                    step.stepInstance.reset();
                }
            }
        },
        run: function () {
            if (this.options.disabled != true) {
                this._running = true;
                this.element.addClass(this.options.classes.running);
                if (this._completed == 0) {
                    if (this.options.sequential) {
                        if (this._steps.length > 0) {
                            this._steps[0].stepInstance.run();
                        }
                    }
                    else {
                        for (var _i = 0, _a = this._steps; _i < _a.length; _i++) {
                            var step = _a[_i];
                            step.stepInstance.run();
                        }
                    }
                }
            }
        },
        setOption: function (key, value) {
            this._super(key, value);
            switch (key) {
                case "viewbox":
                    this._applySvgViewbox(value);
                    break;
                case "svgAttr":
                    this._applySvgAttrs(value);
                    break;
            }
        }
    });
}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqcXVlcnkudG9vbHRpcHN0ZXJlZC1pbWFnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnLCAnanF1ZXJ5JywgJ3N2Zy5qcycsICdqcXVlcnktdWknLCAndG9vbHRpcHN0ZXInXSwgZmFjdG9yeSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZXhwb3J0cy5ub2RlTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgZmFjdG9yeShleHBvcnRzLCByZXF1aXJlKCdqcXVlcnknKSwgcmVxdWlyZSgnc3ZnLmpzJyksIHJlcXVpcmUoJ2pxdWVyeS11aScpLCByZXF1aXJlKCd0b29sdGlwc3RlcicpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZhY3RvcnkoKHJvb3QuanFUb29sdGlwc3RlcmVkSW1hZ2UgPSB7fSksIHJvb3QuJCwgcm9vdC5TVkcpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMsICQsIFNWRykge1xuICAgICQud2lkZ2V0KFwianF0bHBpLnRvb2x0aXBzdGVyZWRJbWFnZVN0ZXBcIiwge1xuICAgICAgICBPTl9DT01QTEVURUQ6IFwidG9vbHRpcHN0ZXJlZEltYWdlU3RlcDpjb21wbGV0ZWRcIixcbiAgICAgICAgU1RBVEVTOiB7XG4gICAgICAgICAgICB3YWl0aW5nOiAwLFxuICAgICAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgICAgIGFjdGl2ZTogMixcbiAgICAgICAgICAgIGNvbXBsZXRlZDogMyxcbiAgICAgICAgICAgIG9wZW46IDRcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgIG1haW46IFwidG9vbHRpcHN0ZXJlZC1pbWFnZV9fc3RlcFwiLFxuICAgICAgICAgICAgICAgIHdhaXRpbmc6IFwidG9vbHRpcHN0ZXJlZC1pbWFnZV9fc3RlcC0td2FpdGluZ1wiLFxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IFwidG9vbHRpcHN0ZXJlZC1pbWFnZV9fc3RlcC0tY3VycmVudFwiLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogXCJ0b29sdGlwc3RlcmVkLWltYWdlX19zdGVwLS1hY3RpdmVcIixcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQ6IFwidG9vbHRpcHN0ZXJlZC1pbWFnZV9fc3RlcC0tY29tcGxldGVkXCIsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IFwidG9vbHRpcHN0ZXJlZC1pbWFnZV9fc3RlcC0tZGlzYWJsZWRcIixcbiAgICAgICAgICAgICAgICBvcGVuOiBcInRvb2x0aXBzdGVyZWQtaW1hZ2VfX3N0ZXAtLW9wZW5cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IHt9LFxuICAgICAgICAgICAgZW5hYmxlVG9vbHRpcDogbnVsbCxcbiAgICAgICAgICAgIGRpc2FibGVUb29sdGlwOiBudWxsLFxuICAgICAgICAgICAgcHJvY2Vzc1RpdGxlOiBudWxsLFxuICAgICAgICAgICAgcHJvY2Vzc1RlbXBsYXRlOiBudWxsLFxuICAgICAgICAgICAgZGVzdHJveVRvb2x0aXA6IG51bGwsXG4gICAgICAgICAgICByZWdpc3RlclRvb2x0aXBFdmVudHM6IG51bGwsXG4gICAgICAgICAgICBpbml0VG9vbHRpcDogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5tYWluKTtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyVG9vbHRpcEV2ZW50cygpO1xuICAgICAgICB9LFxuICAgICAgICBfc2V0U3RhdGVXYWl0aW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSB0aGlzLlNUQVRFUy53YWl0aW5nO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmN1cnJlbnQpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMud2FpdGluZyk7XG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlVG9vbHRpcCgpO1xuICAgICAgICB9LFxuICAgICAgICBfc2V0U3RhdGVDdXJyZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFN0YXRlID09PSB0aGlzLlNUQVRFUy53YWl0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFN0YXRlID0gdGhpcy5TVEFURVMuY3VycmVudDtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMud2FpdGluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmN1cnJlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZVRvb2x0aXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX3NldFN0YXRlQWN0aXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFN0YXRlID09PSB0aGlzLlNUQVRFUy5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFN0YXRlID0gdGhpcy5TVEFURVMuYWN0aXZlO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5jdXJyZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX3NldFN0YXRlQ29tcGxldGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFN0YXRlID09PSB0aGlzLlNUQVRFUy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSB0aGlzLlNUQVRFUy5jb21wbGV0ZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmNvbXBsZXRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9zZXRTdGF0ZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLlNUQVRFUy53YWl0aW5nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRTdGF0ZVdhaXRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLlNUQVRFUy5jdXJyZW50OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRTdGF0ZUN1cnJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLlNUQVRFUy5hY3RpdmU6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFN0YXRlQWN0aXZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5TVEFURVMuY29tcGxldGVkOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXRTdGF0ZUNvbXBsZXRlZCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fZGVzdHJveVRvb2x0aXAoKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NUaXRsZSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc1RlbXBsYXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9pbml0VG9vbHRpcCh0aGlzLm9wdGlvbnMudG9vbHRpcCk7XG4gICAgICAgICAgICB0aGlzLl9zZXRTdGF0ZSh0aGlzLlNUQVRFUy53YWl0aW5nKTtcbiAgICAgICAgfSxcbiAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRTdGF0ZSh0aGlzLlNUQVRFUy5jdXJyZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFN0YXRlKHRoaXMuU1RBVEVTLndhaXRpbmcpO1xuICAgICAgICB9LFxuICAgICAgICBfcHJvY2Vzc1RpdGxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB0aGlzLm9wdGlvbnMucHJvY2Vzc1RpdGxlKS50b0xvd2VyQ2FzZSgpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wcm9jZXNzVGl0bGUuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMudGl0bGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hdHRyKFwidGl0bGVcIiwgdGhpcy5vcHRpb25zLnRpdGxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9wcm9jZXNzVGVtcGxhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHRoaXMub3B0aW9ucy5wcm9jZXNzVGVtcGxhdGUpLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnByb2Nlc3NUZW1wbGF0ZS5jYWxsKHRoaXMsIHRoaXMub3B0aW9ucy50ZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmF0dHIoXCJkYXRhLXRvb2x0aXAtY29udGVudFwiLCB0aGlzLm9wdGlvbnMudGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2Rlc3Ryb3lUb29sdGlwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB0aGlzLm9wdGlvbnMuZGVzdHJveVRvb2x0aXApLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRlc3Ryb3lUb29sdGlwLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50LmRhdGEoXCJ0b29sdGlwc3Rlck5zXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5lbGVtZW50LmRhdGEodGhpcy5lbGVtZW50LmRhdGEoXCJ0b29sdGlwc3Rlck5zXCIpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfaW5pdFRvb2x0aXA6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB0aGlzLm9wdGlvbnMuaW5pdFRvb2x0aXApLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgdGhpcy5vcHRpb25zLnJlZ2lzdGVyVG9vbHRpcEV2ZW50cykudG9Mb3dlckNhc2UoKSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgdGhpcy5vcHRpb25zLmVuYWJsZVRvb2x0aXApLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHR5cGVvZiB0aGlzLm9wdGlvbnMuZGlzYWJsZVRvb2x0aXApLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmluaXRUb29sdGlwLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIlRvb2x0aXBzdGVyZWRJbWFnZVN0ZXBFcnJvcjogSWYgaW5pdFRvb2x0aXAgb3B0aW9uIGlzIHByb3ZpZGVkLCBkaXNhYmxlVG9vbHRpcCBtdXN0IGJlIHByb3ZpZGVkIGFzIHdlbGxcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVG9vbHRpcHN0ZXJlZEltYWdlU3RlcEVycm9yOiBJZiBpbml0VG9vbHRpcCBvcHRpb24gaXMgcHJvdmlkZWQsIGVuYWJsZVRvb2x0aXAgbXVzdCBiZSBwcm92aWRlZCBhcyB3ZWxsXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwiVG9vbHRpcHN0ZXJlZEltYWdlU3RlcEVycm9yOiBJZiBpbml0VG9vbHRpcCBvcHRpb24gaXMgcHJvdmlkZWQsIHJlZ2lzdGVyVG9vbHRpcEV2ZW50cyBtdXN0IGJlIHByb3ZpZGVkIGFzIHdlbGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudG9vbHRpcHN0ZXIob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9yZWdpc3RlclRvb2x0aXBFdmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHRoaXMub3B0aW9ucy5yZWdpc3RlclRvb2x0aXBFdmVudHMpLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnJlZ2lzdGVyVG9vbHRpcEV2ZW50cy5jYWxsKHRoaXMsIHRoaXMuX29uVG9vbHRpcE9wZW5pbmcuYmluZCh0aGlzKSwgdGhpcy5fb25Ub29sdGlwQ2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZWxlbWVudC5kYXRhKHRoaXMuZWxlbWVudC5kYXRhKFwidG9vbHRpcHN0ZXJOc1wiKVswXSk7XG4gICAgICAgICAgICAgICAgdG9vbHRpcC5vbihcInN0YXRlXCIsIHRoaXMuX29uVG9vbHRpcHN0ZXJTdGF0ZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX29uVG9vbHRpcHN0ZXJTdGF0ZUNoYW5nZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlLnN0YXRlID09IFwiYXBwZWFyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblRvb2x0aXBPcGVuaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlLnN0YXRlID09IFwiY2xvc2VkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vblRvb2x0aXBDbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfZW5hYmxlVG9vbHRpcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdGhpcy5vcHRpb25zLmVuYWJsZVRvb2x0aXApLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVuYWJsZVRvb2x0aXAuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC50b29sdGlwc3RlcihcImVuYWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2Rpc2FibGVUb29sdGlwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB0aGlzLm9wdGlvbnMuZGlzYWJsZVRvb2x0aXApLnRvTG93ZXJDYXNlKCkgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRpc2FibGVUb29sdGlwLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudG9vbHRpcHN0ZXIoXCJkaXNhYmxlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfb25Ub29sdGlwT3BlbmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlZCAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0U3RhdGUodGhpcy5TVEFURVMuYWN0aXZlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMub3Blbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9vblRvb2x0aXBDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlZCAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLm9wZW4pO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50U3RhdGUgIT0gdGhpcy5TVEFURVMuY29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldFN0YXRlKHRoaXMuU1RBVEVTLmNvbXBsZXRlZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKHRoaXMuT05fQ09NUExFVEVEKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuZGlzYWJsZWQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTdGF0ZSAhPSB0aGlzLlNUQVRFUy53YWl0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW5hYmxlVG9vbHRpcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLmRpc2FibGVkKTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc2FibGVUb29sdGlwKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkLndpZGdldChcInVpLnRvb2x0aXBzdGVyZWRJbWFnZVwiLCB7XG4gICAgICAgIE9OX0NPTVBMRVRFRDogXCJ0b29sdGlwc3RlcmVkSW1hZ2U6Y29tcGxldGVkXCIsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgICAgICBtYWluOiBcInRvb2x0aXBzdGVyZWQtaW1hZ2VcIixcbiAgICAgICAgICAgICAgICB3YWl0aW5nOiBcInRvb2x0aXBzdGVyZWQtaW1hZ2UtLXJ1bm5pbmdcIixcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQ6IFwidG9vbHRpcHN0ZXJlZC1pbWFnZS0tY29tcGxldGVkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdmdVcmw6IFwiXCIsXG4gICAgICAgICAgICBzdmdBdHRyOiB7XG4gICAgICAgICAgICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbzogXCJ4TWlkWU1pZCBtZWV0XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgICAgICAgYXV0b1N0b3A6IGZhbHNlLFxuICAgICAgICAgICAgaW5pdGlhbGl6ZWQ6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgX2NyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fY29tcGxldGVkID0gMDtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5tYWluKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB9LFxuICAgICAgICByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5faW5pdFN2ZygpO1xuICAgICAgICB9LFxuICAgICAgICBfY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdmdDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoXCIjXCIgKyB0aGlzLl9zdmdDb250ZXh0LmlkKCkpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBfYXBwbHlTdmdBdHRyczogZnVuY3Rpb24gKGF0dHJzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3ZnQ29udGV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N2Z0NvbnRleHQuYXR0cihhdHRycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9hcHBseVN2Z1ZpZXdib3g6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdmdDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdmdDb250ZXh0LnZpZXdib3guYXBwbHkodGhpcy5fc3ZnQ29udGV4dCwgY29uZmlnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N2Z0NvbnRleHQudmlld2JveChjb25maWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2luaXRTdmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlciA9ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgICAgIHRoaXMuX3N2Z0NvbnRleHQgPSBTVkcodGhpcy5lbGVtZW50LmdldCgwKSkuc2l6ZShcIjEwMCVcIiwgXCIxMDAlXCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy52aWV3Ym94KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlTdmdWaWV3Ym94KHRoaXMub3B0aW9ucy52aWV3Ym94KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3ZnQXR0cikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ZnQXR0cnModGhpcy5vcHRpb25zLnN2Z0F0dHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByb21pc2UgPSB0aGlzLl9sb2FkU3ZnRmlsZSgpO1xuICAgICAgICAgICAgcHJvbWlzZS50aGVuKHRoaXMuX29uUHJvY2Vzc2VkU3ZnRmlsZS5iaW5kKHRoaXMsIGRlZmVyKSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmZXIucHJvbWlzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBfb25Qcm9jZXNzZWRTdmdGaWxlOiBmdW5jdGlvbiAoZGVmZXIsIHN2Z1N0cmluZykge1xuICAgICAgICAgICAgdGhpcy5fc3ZnQ29udGV4dC5zdmcoc3ZnU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3NTdmdFbGVtZW50cygpO1xuICAgICAgICAgICAgaWYgKCh0eXBlb2YgdGhpcy5vcHRpb25zLmluaXRpYWxpemVkKS50b0xvd2VyQ2FzZSgpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pbml0aWFsaXplZCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1J1biA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3Byb2Nlc3NTdmdGaWxlOiBmdW5jdGlvbiAoZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBkb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhkb2N1bWVudEVsZW1lbnQpLnJlcGxhY2UoL148c3ZnW14+XSo+LywgXCJcIikucmVwbGFjZSgvPFxcL3N2Zz4vLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IFwiW0VSUk9SXSBUb29sdGlwc3RlcmVkSW1hZ2VFcnJvcjogVGhlIHJlcXVlc3RlZCBmaWxlIGlzIG5vdCB2YWxpZDpcIiArIHRoaXMub3B0aW9ucy5zdmdVcmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIF9vbkdldFN2Z0ZpbGVTdWNjZXNzOiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB2YXIganFBamF4T2JqZWN0ID0gdGhpcywgaW5zdGFuY2UgPSBqcUFqYXhPYmplY3QuX2RhdGEuY29udGV4dCwgZGVmZXIgPSBqcUFqYXhPYmplY3QuX2RhdGEuZGVmZXIsIHN2Z1N0cmluZyA9IGluc3RhbmNlLl9wcm9jZXNzU3ZnRmlsZShyZXN1bHQuZG9jdW1lbnRFbGVtZW50KTtcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmVXaXRoKGluc3RhbmNlLCBbc3ZnU3RyaW5nXSk7XG4gICAgICAgIH0sXG4gICAgICAgIF9vbkdldFN2Z0ZpbGVGYWlsOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbRXJyb3JdIFRvb2x0aXBzdGVyZWRJbWFnZUVycm9yOiBUaGUgc3ZnIGZpbGUgY291bGQgbm90IGJlIGxvYWRlZFwiKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9LFxuICAgICAgICBfbG9hZFN2Z0ZpbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZWZlciA9ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgICAgIGlmICghIXRoaXMub3B0aW9ucy5zdmdVcmwpIHtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZG9jdW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB0aGlzLm9wdGlvbnMuc3ZnVXJsLFxuICAgICAgICAgICAgICAgICAgICBfZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVyOiBkZWZlclxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkudGhlbih0aGlzLl9vbkdldFN2Z0ZpbGVTdWNjZXNzLCB0aGlzLl9vbkdldFN2Z0ZpbGVGYWlsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbRVJST1JdIFRvb2x0aXBzdGVyZWRJbWFnZUVycm9yOiBUaGUgc3ZnVXJsIG9wdGlvbiBpcyBvYmxpZ2F0b3J5XCIpO1xuICAgICAgICAgICAgICAgIGRlZmVyLnJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3Byb2Nlc3NTdmdFbGVtZW50OiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgdmFyIHN2Z0VsZW1lbnQgPSBTVkcuZ2V0KGl0ZW0uaWQpO1xuICAgICAgICAgICAgaWYgKHN2Z0VsZW1lbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJChzdmdFbGVtZW50Lm5vZGUpLnRvb2x0aXBzdGVyZWRJbWFnZVN0ZXAoJC5leHRlbmQoe1xuICAgICAgICAgICAgICAgICAgICBzdmc6IHN2Z0VsZW1lbnRcbiAgICAgICAgICAgICAgICB9LCBpdGVtKSk7XG4gICAgICAgICAgICAgICAgdmFyICRzdmcgPSAkKHN2Z0VsZW1lbnQubm9kZSksIGluc3RhbmNlID0gJHN2Zy50b29sdGlwc3RlcmVkSW1hZ2VTdGVwKFwiaW5zdGFuY2VcIiksIHByb2Nlc3NlZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgJHN2ZzogJHN2ZyxcbiAgICAgICAgICAgICAgICAgICAgc3RlcEluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgc3ZnOiBzdmdFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBpdGVtXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAkc3ZnLm9mZihcInRvb2x0aXBzdGVyZWRJbWFnZVN0ZXA6Y29tcGxldGVkXCIpO1xuICAgICAgICAgICAgICAgICRzdmcub24oXCJ0b29sdGlwc3RlcmVkSW1hZ2VTdGVwOmNvbXBsZXRlZFwiLCB7IGluc3RhbmNlOiB0aGlzIH0sIHRoaXMuX29uU3RlcENvbXBsZXRlZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3NlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX3Byb2Nlc3NTdmdFbGVtZW50czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N2Z0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGVwcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMub3B0aW9ucy5pdGVtcztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVtSW5kZXggPSAwLCBpdGVtc0xlbmd0aCA9IGl0ZW1zLmxlbmd0aDsgaXRlbUluZGV4IDwgaXRlbXNMZW5ndGg7IGl0ZW1JbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbSA9IGl0ZW1zW2l0ZW1JbmRleF0sIHN0ZXAgPSB0aGlzLl9wcm9jZXNzU3ZnRWxlbWVudChjdXJyZW50SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGVwICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RlcHMucHVzaChzdGVwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX29uU3RlcENvbXBsZXRlZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IGUuZGF0YS5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLl9jb21wbGV0ZWQrKztcbiAgICAgICAgICAgIGlmICghaW5zdGFuY2UuX2NoZWNrQ29tcGxldGVkKCkpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5fcnVuTmV4dFN0ZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX3J1bk5leHRTdGVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNlcXVlbnRpYWwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGVwc1t0aGlzLl9jb21wbGV0ZWRdLnN0ZXBJbnN0YW5jZS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgX2NoZWNrQ29tcGxldGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29tcGxldGVkID09IHRoaXMuX3N0ZXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvU3RvcCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3ModGhpcy5vcHRpb25zLmNsYXNzZXMuY29tcGxldGVkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcih0aGlzLk9OX0NPTVBMRVRFRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fcnVubmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5fc3RlcHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGVwID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgICAgICBzdGVwLnN0ZXBJbnN0YW5jZS5kaXNhYmxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5ydW5uaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fcnVubmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlZCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMuX3N0ZXBzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RlcCA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICAgICAgc3RlcC5zdGVwSW5zdGFuY2UucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlZCAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMub3B0aW9ucy5jbGFzc2VzLnJ1bm5pbmcpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jb21wbGV0ZWQgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNlcXVlbnRpYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGVwcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RlcHNbMF0uc3RlcEluc3RhbmNlLnJ1bigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMuX3N0ZXBzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGVwID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAuc3RlcEluc3RhbmNlLnJ1bigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZXRPcHRpb246IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdXBlcihrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInZpZXdib3hcIjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlTdmdWaWV3Ym94KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInN2Z0F0dHJcIjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlTdmdBdHRycyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KSk7XG4iXSwiZmlsZSI6ImpxdWVyeS50b29sdGlwc3RlcmVkLWltYWdlLmpzIn0=
