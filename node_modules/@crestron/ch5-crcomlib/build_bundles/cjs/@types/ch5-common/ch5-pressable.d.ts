import { Ch5Common } from '../ch5-common/ch5-common';
import { Subject } from 'rxjs';
export interface ICh5PressableOptions {
    cssTargetElement: HTMLElement;
    cssPressedClass: string;
    enableSwipe: boolean;
}
export declare class Ch5Pressable {
    private static FingerState;
    private _fingerState;
    private _ch5Component;
    private _options;
    private _pressEvent;
    private _releaseEvent;
    _pressed: boolean;
    _released: boolean;
    observablePressed: Subject<boolean>;
    private readonly TOUCH_TIMEOUT;
    private readonly CLICK_MOVE_THRESHOLD;
    constructor(component: Ch5Common, options?: ICh5PressableOptions);
    get ch5Component(): Ch5Common;
    get options(): ICh5PressableOptions | null;
    init(): void;
    setPressed(value: boolean): void;
    destroy(): void;
    private _attachEvents;
    private _removeEvents;
    private _onClick;
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    resetPressAndReleaseActions(): void;
    private _onPointerLeave;
    private _onTouchHoldTimer;
    private _fingerIsDownActions;
    private _onHold;
    private _onRelease;
    private _addCssPressClass;
    private _removeCssPressClass;
}
