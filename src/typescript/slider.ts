import { container as el } from "./player";
import { deepEventHandler, getOffsetLeft } from "./helper";

export default class Slider {
    private activeEl: HTMLElement
    private barEl: HTMLElement
    private innerEl: HTMLElement
    
    private value: number
    private dragging = false

    private beginDragHandlers: Array<(e: MouseEvent | TouchEvent) => void> = []
    private endDragHandlers: Array<(e: MouseEvent | TouchEvent) => void> = []
    private valueChangeHandlers: Array<(e: number) => void> = []
    
    constructor(options: SliderOptions) {
        this.activeEl = el.querySelector(options.activeSelector);
        this.barEl = el.querySelector(options.barSelector);
        this.innerEl = el.querySelector(options.innerSelector);
        this.value = options.value || 1;

        deepEventHandler(this.activeEl, "mousedown", (e: MouseEvent | TouchEvent) => {this.handleBeginDrag(e);});
        deepEventHandler(this.activeEl, "touchstart", (e: MouseEvent | TouchEvent) => {this.handleBeginDrag(e);});
        window.addEventListener("mousemove", (e: MouseEvent | TouchEvent) => {this.update(e);});
        window.addEventListener("touchmove", (e: MouseEvent | TouchEvent) => {this.update(e);});
        window.addEventListener("mouseup", (e: MouseEvent | TouchEvent) => {this.handleEndDrag(e);});
        window.addEventListener("touchend", (e: MouseEvent | TouchEvent) => {this.handleEndDrag(e);});
    }

    private handleBeginDrag(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        if (this.dragging) { return; }
        this.dragging = true;
        this.barEl.classList.add("penguin-player--slider-dragging");
        for (let callback of this.beginDragHandlers) {
            try {
                callback(e);
            } catch(e) { console.error(e); }
        }
        this.update(e);
    }

    private handleEndDrag(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        if (e instanceof TouchEvent && e.touches.length > 0) { return; }
        this.dragging = false;
        this.barEl.classList.remove("penguin-player--slider-dragging");
        for (let callback of this.endDragHandlers) {
            try {
                callback(e);
            } catch(e) { console.error(e); }
        }
    }

    private update(e: MouseEvent | TouchEvent) {
        if (!this.dragging) { return; }
        let cx = 0;
        if (e instanceof MouseEvent) {
            cx = e.pageX;
        } else {
            cx = e.touches[0].pageX;
        }
        let left = Math.max(0, cx - getOffsetLeft(this.barEl));
        let width = this.barEl.clientWidth;
        let progress = Math.min(1, left / width);
        if (progress != this.value) {
            this.innerEl.style.width = `${progress * 100}%`;
            this.value = progress;
            this.broadcastValue();
        }
    }

    private broadcastValue() {
        for (let callback of this.valueChangeHandlers) {
            try {
                callback(this.value);
            } catch (e) { console.error(e); }
        }
    }

    addEventHandler(name: "begindrag" | "enddrag" | "valuechange", callback: (e: any) => void) {
        switch (name) {
            case "begindrag":
                this.beginDragHandlers.push(callback);
                break;
            case "enddrag":
                this.endDragHandlers.push(callback);
                break;
            case "valuechange":
                this.valueChangeHandlers.push(callback);
                break;
        }
    }

    setValue(e: number) {
        this.innerEl.style.width = `${e * 100}%`;
        this.value = e;
        this.broadcastValue();
    }
}