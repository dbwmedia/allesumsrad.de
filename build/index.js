/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@studio-freight/lenis/dist/lenis.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@studio-freight/lenis/dist/lenis.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lenis)
/* harmony export */ });
function t(t,e,i){return Math.max(t,Math.min(e,i))}class Animate{advance(e){if(!this.isRunning)return;let i=!1;if(this.lerp)this.value=(s=this.value,o=this.to,n=60*this.lerp,r=e,function(t,e,i){return(1-i)*t+i*e}(s,o,1-Math.exp(-n*r))),Math.round(this.value)===this.to&&(this.value=this.to,i=!0);else{this.currentTime+=e;const s=t(0,this.currentTime/this.duration,1);i=s>=1;const o=i?1:this.easing(s);this.value=this.from+(this.to-this.from)*o}var s,o,n,r;this.onUpdate?.(this.value,i),i&&this.stop()}stop(){this.isRunning=!1}fromTo(t,e,{lerp:i=.1,duration:s=1,easing:o=(t=>t),onStart:n,onUpdate:r}){this.from=this.value=t,this.to=e,this.lerp=i,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,n?.(),this.onUpdate=r}}class Dimensions{constructor({wrapper:t,content:e,autoResize:i=!0,debounce:s=250}={}){this.wrapper=t,this.content=e,i&&(this.debouncedResize=function(t,e){let i;return function(){let s=arguments,o=this;clearTimeout(i),i=setTimeout((function(){t.apply(o,s)}),e)}}(this.resize,s),this.wrapper===window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper===window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper===window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}}class Emitter{constructor(){this.events={}}emit(t,...e){let i=this.events[t]||[];for(let t=0,s=i.length;t<s;t++)i[t](...e)}on(t,e){return this.events[t]?.push(e)||(this.events[t]=[e]),()=>{this.events[t]=this.events[t]?.filter((t=>e!==t))}}off(t,e){this.events[t]=this.events[t]?.filter((t=>e!==t))}destroy(){this.events={}}}const e=100/6;class VirtualScroll{constructor(t,{wheelMultiplier:e=1,touchMultiplier:i=1}){this.element=t,this.wheelMultiplier=e,this.touchMultiplier=i,this.touchStart={x:null,y:null},this.emitter=new Emitter,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,{passive:!1}),this.element.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.addEventListener("touchend",this.onTouchEnd,{passive:!1})}on(t,e){return this.emitter.on(t,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,{passive:!1}),this.element.removeEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.removeEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.removeEventListener("touchend",this.onTouchEnd,{passive:!1})}onTouchStart=t=>{const{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{const{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t,s=-(e-this.touchStart.x)*this.touchMultiplier,o=-(i-this.touchStart.y)*this.touchMultiplier;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:s,y:o},this.emitter.emit("scroll",{deltaX:s,deltaY:o,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:i,deltaY:s,deltaMode:o}=t;i*=1===o?e:2===o?this.windowWidth:1,s*=1===o?e:2===o?this.windowHeight:1,i*=this.wheelMultiplier,s*=this.wheelMultiplier,this.emitter.emit("scroll",{deltaX:i,deltaY:s,event:t})};onWindowResize=()=>{this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight}}class Lenis{constructor({wrapper:t=window,content:e=document.documentElement,wheelEventsTarget:i=t,eventsTarget:s=i,smoothWheel:o=!0,syncTouch:n=!1,syncTouchLerp:r=.075,touchInertiaMultiplier:l=35,duration:h,easing:a=(t=>Math.min(1,1.001-Math.pow(2,-10*t))),lerp:c=!h&&.1,infinite:d=!1,orientation:p="vertical",gestureOrientation:u="vertical",touchMultiplier:m=1,wheelMultiplier:v=1,autoResize:g=!0,__experimental__naiveDimensions:S=!1}={}){this.__isSmooth=!1,this.__isScrolling=!1,this.__isStopped=!1,this.__isLocked=!1,this.onVirtualScroll=({deltaX:t,deltaY:e,event:i})=>{if(i.ctrlKey)return;const s=i.type.includes("touch"),o=i.type.includes("wheel");if(this.options.syncTouch&&s&&"touchstart"===i.type&&!this.isStopped&&!this.isLocked)return void this.reset();const n=0===t&&0===e,r="vertical"===this.options.gestureOrientation&&0===e||"horizontal"===this.options.gestureOrientation&&0===t;if(n||r)return;let l=i.composedPath();if(l=l.slice(0,l.indexOf(this.rootElement)),l.find((t=>{var e,i,n,r,l;return(null===(e=t.hasAttribute)||void 0===e?void 0:e.call(t,"data-lenis-prevent"))||s&&(null===(i=t.hasAttribute)||void 0===i?void 0:i.call(t,"data-lenis-prevent-touch"))||o&&(null===(n=t.hasAttribute)||void 0===n?void 0:n.call(t,"data-lenis-prevent-wheel"))||(null===(r=t.classList)||void 0===r?void 0:r.contains("lenis"))&&!(null===(l=t.classList)||void 0===l?void 0:l.contains("lenis-stopped"))})))return;if(this.isStopped||this.isLocked)return void i.preventDefault();if(this.isSmooth=this.options.syncTouch&&s||this.options.smoothWheel&&o,!this.isSmooth)return this.isScrolling=!1,void this.animate.stop();i.preventDefault();let h=e;"both"===this.options.gestureOrientation?h=Math.abs(e)>Math.abs(t)?e:t:"horizontal"===this.options.gestureOrientation&&(h=t);const a=s&&this.options.syncTouch,c=s&&"touchend"===i.type&&Math.abs(h)>5;c&&(h=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+h,Object.assign({programmatic:!1},a?{lerp:c?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}))},this.onNativeScroll=()=>{if(!this.__preventNextScrollEvent&&!this.isScrolling){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.velocity=0,this.direction=Math.sign(this.animatedScroll-t),this.emit()}},window.lenisVersion="1.0.42",t!==document.documentElement&&t!==document.body||(t=window),this.options={wrapper:t,content:e,wheelEventsTarget:i,eventsTarget:s,smoothWheel:o,syncTouch:n,syncTouchLerp:r,touchInertiaMultiplier:l,duration:h,easing:a,lerp:c,infinite:d,gestureOrientation:u,orientation:p,touchMultiplier:m,wheelMultiplier:v,autoResize:g,__experimental__naiveDimensions:S},this.animate=new Animate,this.emitter=new Emitter,this.dimensions=new Dimensions({wrapper:t,content:e,autoResize:g}),this.toggleClassName("lenis",!0),this.velocity=0,this.isLocked=!1,this.isStopped=!1,this.isSmooth=n||o,this.isScrolling=!1,this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.virtualScroll=new VirtualScroll(s,{touchMultiplier:m,wheelMultiplier:v}),this.virtualScroll.on("scroll",this.onVirtualScroll)}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.toggleClassName("lenis",!1),this.toggleClassName("lenis-smooth",!1),this.toggleClassName("lenis-scrolling",!1),this.toggleClassName("lenis-stopped",!1),this.toggleClassName("lenis-locked",!1)}on(t,e){return this.emitter.on(t,e)}off(t,e){return this.emitter.off(t,e)}setScroll(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t}resize(){this.dimensions.resize()}emit(){this.emitter.emit("scroll",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.isStopped=!1,this.reset())}stop(){this.isStopped||(this.isStopped=!0,this.animate.stop(),this.reset())}raf(t){const e=t-(this.time||t);this.time=t,this.animate.advance(.001*e)}scrollTo(e,{offset:i=0,immediate:s=!1,lock:o=!1,duration:n=this.options.duration,easing:r=this.options.easing,lerp:l=!n&&this.options.lerp,onComplete:h,force:a=!1,programmatic:c=!0}={}){if(!this.isStopped&&!this.isLocked||a){if(["top","left","start"].includes(e))e=0;else if(["bottom","right","end"].includes(e))e=this.limit;else{let t;if("string"==typeof e?t=document.querySelector(e):(null==e?void 0:e.nodeType)&&(t=e),t){if(this.options.wrapper!==window){const t=this.options.wrapper.getBoundingClientRect();i-=this.isHorizontal?t.left:t.top}const s=t.getBoundingClientRect();e=(this.isHorizontal?s.left:s.top)+this.animatedScroll}}if("number"==typeof e){if(e+=i,e=Math.round(e),this.options.infinite?c&&(this.targetScroll=this.animatedScroll=this.scroll):e=t(0,e,this.limit),s)return this.animatedScroll=this.targetScroll=e,this.setScroll(this.scroll),this.reset(),void(null==h||h(this));if(!c){if(e===this.targetScroll)return;this.targetScroll=e}this.animate.fromTo(this.animatedScroll,e,{duration:n,easing:r,lerp:l,onStart:()=>{o&&(this.isLocked=!0),this.isScrolling=!0},onUpdate:(t,e)=>{this.isScrolling=!0,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),c&&(this.targetScroll=t),e||this.emit(),e&&(this.reset(),this.emit(),null==h||h(this),this.__preventNextScrollEvent=!0,requestAnimationFrame((()=>{delete this.__preventNextScrollEvent})))}})}}}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}get scroll(){return this.options.infinite?(t=this.animatedScroll,e=this.limit,(t%e+e)%e):this.animatedScroll;// removed by dead control flow
{ var t, e; }}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isSmooth(){return this.__isSmooth}set isSmooth(t){this.__isSmooth!==t&&(this.__isSmooth=t,this.toggleClassName("lenis-smooth",t))}get isScrolling(){return this.__isScrolling}set isScrolling(t){this.__isScrolling!==t&&(this.__isScrolling=t,this.toggleClassName("lenis-scrolling",t))}get isStopped(){return this.__isStopped}set isStopped(t){this.__isStopped!==t&&(this.__isStopped=t,this.toggleClassName("lenis-stopped",t))}get isLocked(){return this.__isLocked}set isLocked(t){this.__isLocked!==t&&(this.__isLocked=t,this.toggleClassName("lenis-locked",t))}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),this.isSmooth&&(t+=" lenis-smooth"),t}toggleClassName(t,e){this.rootElement.classList.toggle(t,e),this.emitter.emit("className change",this)}}
//# sourceMappingURL=lenis.mjs.map


/***/ }),

/***/ "./src/js/components/buttonRipple.js":
/*!*******************************************!*\
  !*** ./src/js/components/buttonRipple.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Button Ripple Effect Component
 * Optimiert für Performance und Web Standards 2025
 */
const Component_ButtonRipple = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const buttonCache = new WeakMap();
  let rafId = null;
  const initButtonRipples = () => {
    if (prefersReducedMotion) return;
    const buttons = document.querySelectorAll("a.button--primary, a.button--black, a.button--outline, a.button--glass, a.button--accent, a.button--success, a.button--warning, a.button--dbw");
    if (buttons.length === 0) return;
    buttons.forEach(button => {
      if (button.matches(".our-work, .button-icon, .gb-accordion__toggle")) {
        return;
      }
      setupButtonRipple(button);
    });
  };
  const setupButtonRipple = button => {
    const buttonData = {
      lastX: 0,
      lastY: 0,
      lastTime: 0
    };
    buttonCache.set(button, buttonData);
    const handleMouseEnter = e => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = calculateMaxDistance(x, y, rect.width, rect.height);
      const rippleSize = Math.ceil(maxDistance * 2.2);
      buttonData.lastX = x;
      buttonData.lastY = y;
      buttonData.lastTime = Date.now();
      requestAnimationFrame(() => {
        button.style.setProperty("--ripple-x", x + "px");
        button.style.setProperty("--ripple-y", y + "px");
        button.style.setProperty("--ripple-size", rippleSize + "px");
      });
    };
    const handleMouseMove = e => {
      const data = buttonCache.get(button);
      if (!data) return;
      const now = Date.now();
      if (now - data.lastTime < 16) return;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const distance = Math.sqrt(Math.pow(x - data.lastX, 2) + Math.pow(y - data.lastY, 2));
      if (distance < 5) return;
      const maxDistance = calculateMaxDistance(x, y, rect.width, rect.height);
      const rippleSize = Math.ceil(maxDistance * 2.2);
      data.lastX = x;
      data.lastY = y;
      data.lastTime = now;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        button.style.setProperty("--ripple-x", x + "px");
        button.style.setProperty("--ripple-y", y + "px");
        button.style.setProperty("--ripple-size", rippleSize + "px");
      });
    };
    button.addEventListener("mouseenter", handleMouseEnter, {
      passive: true
    });
    button.addEventListener("mousemove", handleMouseMove, {
      passive: true
    });
    if ("ontouchstart" in window) {
      button.addEventListener("touchstart", handleMouseEnter, {
        passive: true
      });
    }
  };
  const calculateMaxDistance = (x, y, width, height) => {
    return Math.max(Math.hypot(x, y), Math.hypot(width - x, y), Math.hypot(x, height - y), Math.hypot(width - x, height - y));
  };
  const reinitialize = () => {
    destroy();
    initButtonRipples();
  };
  const destroy = () => {
    const buttons = document.querySelectorAll('a[class*="button"]');
    buttons.forEach(button => {
      button.style.removeProperty("--ripple-x");
      button.style.removeProperty("--ripple-y");
      button.style.removeProperty("--ripple-size");
      buttonCache.delete(button);
    });
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  const init = () => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initButtonRipples);
    } else {
      initButtonRipples();
    }
    window.ButtonRipple = {
      reinitialize: reinitialize,
      destroy: destroy,
      setupButtonRipple: setupButtonRipple
    };
  };
  init();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component_ButtonRipple);

/***/ }),

/***/ "./src/js/components/heroParallax.js":
/*!*******************************************!*\
  !*** ./src/js/components/heroParallax.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * DBW Apple-Style Parallax Component
 * Separater Transform für Background und Content mit antizyklischer Bewegung
 */
const Component_Parallax = () => {
  const CONFIG = {
    bgSpeed: 0.8,
    bgMaxMove: 400,
    bgMaxScale: 0.3,
    contentSpeed: 0.6,
    contentMaxMove: 250,
    contentMaxScale: 0.15,
    contentOpacity: true,
    contentOpacityMin: 0.2,
    throttleDelay: 0,
    smoothness: 0.15
  };
  const heroElements = document.querySelectorAll('[class*="dbw-hero-"]');
  if (heroElements.length === 0) return;
  const isMobile = () => window.innerWidth <= 768;
  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lerp = (start, end, factor) => start + (end - start) * factor;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeOutQuad = t => t * (2 - t);
  heroElements.forEach(hero => {
    const bgElement = hero.querySelector(".dbw-hero-background");
    const heroContent = hero.querySelector(".dbw-hero-content");
    if (bgElement) {
      const hasImg = bgElement.querySelector("img");
      const hasBgImage = window.getComputedStyle(bgElement).backgroundImage !== "none";
      if (hasImg || hasBgImage) {
        hero.classList.add("has-bg-image");
      }
    }
    const inlineBgImage = hero.style.backgroundImage;
    if (inlineBgImage && bgElement) {
      bgElement.style.backgroundImage = inlineBgImage;
      hero.style.backgroundImage = "";
      hero.classList.add("has-bg-image");
    }
    if (!bgElement || isMobile() || prefersReducedMotion()) return;
    let currentBgY = 0;
    let currentBgScale = 1;
    let currentContentY = 0;
    let currentContentScale = 1;
    let currentContentOpacity = 1;
    let targetBgY = 0;
    let targetBgScale = 1;
    let targetContentY = 0;
    let targetContentScale = 1;
    let targetContentOpacity = 1;
    let ticking = false;
    const updateTransforms = () => {
      const rect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight;
      const windowHeight = window.innerHeight;
      const heroTop = rect.top;
      const heroBottom = rect.bottom;
      if (heroBottom < 0 || heroTop > windowHeight) {
        ticking = false;
        return;
      }
      let scrollProgress = 0;
      if (heroTop <= 0) {
        scrollProgress = Math.min(1, Math.abs(heroTop) / heroHeight);
      }
      const easedProgress = easeOutQuad(scrollProgress);
      targetBgY = easedProgress * CONFIG.bgMaxMove * CONFIG.bgSpeed;
      targetBgScale = 1 + easedProgress * CONFIG.bgMaxScale;
      targetContentY = easedProgress * CONFIG.contentMaxMove * CONFIG.contentSpeed * -1;
      targetContentScale = 1 - easedProgress * CONFIG.contentMaxScale;
      if (CONFIG.contentOpacity) {
        targetContentOpacity = 1 - easedProgress * (1 - CONFIG.contentOpacityMin);
      }
      currentBgY = lerp(currentBgY, targetBgY, CONFIG.smoothness);
      currentBgScale = lerp(currentBgScale, targetBgScale, CONFIG.smoothness);
      currentContentY = lerp(currentContentY, targetContentY, CONFIG.smoothness);
      currentContentScale = lerp(currentContentScale, targetContentScale, CONFIG.smoothness);
      currentContentOpacity = lerp(currentContentOpacity, targetContentOpacity, CONFIG.smoothness);
      if (bgElement) {
        bgElement.style.transform = `translate3d(0, ${currentBgY}px, 0) scale(${currentBgScale})`;
      }
      if (heroContent) {
        heroContent.style.transform = `translate3d(0, ${currentContentY}px, 0) scale(${currentContentScale})`;
        if (CONFIG.contentOpacity) {
          heroContent.style.opacity = currentContentOpacity;
        }
      }
      const bgDiff = Math.abs(targetBgY - currentBgY);
      const bgScaleDiff = Math.abs(targetBgScale - currentBgScale);
      const contentDiff = Math.abs(targetContentY - currentContentY);
      const scaleDiff = Math.abs(targetContentScale - currentContentScale);
      if (bgDiff > 0.1 || bgScaleDiff > 0.001 || contentDiff > 0.1 || scaleDiff > 0.001) {
        requestAnimationFrame(updateTransforms);
      } else {
        ticking = false;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateTransforms);
        ticking = true;
      }
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, {
            passive: true
          });
          onScroll();
        } else {
          window.removeEventListener("scroll", onScroll);
          ticking = false;
        }
      });
    }, {
      rootMargin: "10% 0px"
    });
    observer.observe(hero);
    const handleResize = () => {
      if (isMobile()) {
        if (bgElement) bgElement.style.transform = "";
        if (heroContent) heroContent.style.transform = "";
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
      }
    };
    window.addEventListener("resize", handleResize);
    if (bgElement) {
      bgElement.style.transformOrigin = "center center";
      const bgImg = bgElement.querySelector("img");
      if (bgImg) {
        bgImg.style.transformOrigin = "center center";
        bgImg.style.willChange = "transform";
      }
    }
    if (heroContent) {
      heroContent.style.transformOrigin = "center bottom";
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component_Parallax);

/***/ }),

/***/ "./src/js/components/offsetScroll.js":
/*!*******************************************!*\
  !*** ./src/js/components/offsetScroll.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Component_OffsetScroll = () => {
  const smoothScrollLinks = document.querySelectorAll("a.smooth-scroll");
  smoothScrollLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const targetID = this.getAttribute("href").split("#")[1];
      const targetElement = document.getElementById(targetID);
      if (targetElement) {
        const hasOffset = this.hasAttribute("data-offset");
        const offset = hasOffset ? parseInt(this.dataset.offset, 10) : 0;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component_OffsetScroll);

/***/ }),

/***/ "./src/js/components/scrollHandler.js":
/*!********************************************!*\
  !*** ./src/js/components/scrollHandler.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Component_ScrollHandler = () => {
  const header = document.querySelector("header");
  if (!header) {
    console.warn("Header element not found");
    return null;
  }
  const isHome = typeof window !== "undefined" && window.location.pathname === "/";
  if (isHome) {
    // Scroll-abhängige Klasse auf Startseite
    const updateHeaderClass = () => {
      if (window.scrollY > 0) {
        header.classList.add("scroll");
      } else {
        header.classList.remove("scroll");
      }
    };
    updateHeaderClass(); // Direkt beim Laden
    window.addEventListener("scroll", updateHeaderClass, {
      passive: true
    });
  } else {
    // Auf allen anderen Seiten direkt Klasse setzen
    header.classList.add("scroll");
  }
  return null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component_ScrollHandler);

/***/ }),

/***/ "./src/js/components/smartGrid.js":
/*!****************************************!*\
  !*** ./src/js/components/smartGrid.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Smart Grid Component
 * Automatically assigns grid classes based on number of children
 * + Handles spacing between consecutive grids
 */
const Component_SmartGrid = () => {
  const initSmartGrids = () => {
    const autoGrids = document.querySelectorAll(".grid.auto");
    if (autoGrids.length === 0) return;
    autoGrids.forEach((grid, index) => {
      processGrid(grid, index);
    });
    handleConsecutiveGridSpacing(autoGrids);
  };
  const handleConsecutiveGridSpacing = grids => {
    grids.forEach(grid => {
      const prevSibling = grid.previousElementSibling;
      if (prevSibling && prevSibling.classList.contains("grid")) {
        grid.classList.add("grid-follows-grid");
      } else {
        grid.classList.remove("grid-follows-grid");
      }
    });
  };
  const processGrid = (grid, index) => {
    const children = Array.from(grid.children).filter(child => child.tagName.toLowerCase() === "div");
    const childCount = children.length;
    removeExistingAutoClasses(grid);
    const gridClass = getGridClass(childCount);
    grid.classList.add(gridClass);
    grid.setAttribute("data-smart-grid-children", childCount);
    grid.setAttribute("data-smart-grid-class", gridClass);
  };
  const removeExistingAutoClasses = grid => {
    const autoClasses = ["grid-auto-1", "grid-auto-2", "grid-auto-3", "grid-auto-4", "grid-auto-5", "grid-auto-6", "grid-auto-many"];
    autoClasses.forEach(className => {
      grid.classList.remove(className);
    });
  };
  const getGridClass = count => {
    if (count === 0) return "grid-auto-1";
    if (count === 1) return "grid-auto-1";
    if (count === 2) return "grid-auto-2";
    if (count === 3) return "grid-auto-3";
    if (count === 4) return "grid-auto-4";
    if (count === 5) return "grid-auto-5";
    if (count === 6) return "grid-auto-6";
    return "grid-auto-many";
  };
  const reinitialize = () => {
    initSmartGrids();
  };
  const init = () => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initSmartGrids);
    } else {
      initSmartGrids();
    }
    window.SmartGrid = {
      reinitialize: reinitialize,
      processGrid: processGrid
    };
  };
  init();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component_SmartGrid);

/***/ }),

/***/ "./src/js/components/smoothScroll.js":
/*!*******************************************!*\
  !*** ./src/js/components/smoothScroll.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _studio_freight_lenis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @studio-freight/lenis */ "./node_modules/@studio-freight/lenis/dist/lenis.mjs");

const Component_SmoothScroll = () => {
  if (typeof _studio_freight_lenis__WEBPACK_IMPORTED_MODULE_0__["default"] !== "function") {
    document.documentElement.style.overflow = "auto";
    return;
  }
  let lenis;
  try {
    lenis = new _studio_freight_lenis__WEBPACK_IMPORTED_MODULE_0__["default"]({
      smooth: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch (error) {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component_SmoothScroll);

/***/ }),

/***/ "./src/js/components/updateDynamicAnchors.js":
/*!***************************************************!*\
  !*** ./src/js/components/updateDynamicAnchors.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Component_UpdateDynamicAnchors = () => {
  // Selektiere Buttons mit spezifischen href-Attributen
  const anchorSelectors = ["a[href='#bewerben']", "a[href='#learn-more']"];
  const buttons = document.querySelectorAll(anchorSelectors.join(","));
  if (buttons.length === 0) {
    return;
  }
  buttons.forEach(button => {
    const targetId = button.getAttribute("href"); // Ziel-Anker (#bewerben oder #learn-more)
    const newHref = `${window.location.origin}${window.location.pathname}${targetId}`;

    // Aktualisiere das href-Attribut des Buttons
    button.setAttribute("href", newHref);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component_UpdateDynamicAnchors);

/***/ }),

/***/ "./src/js/loader.js":
/*!**************************!*\
  !*** ./src/js/loader.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Component Loader
 * Lädt Components basierend auf ihrer Priorität
 */
class ComponentLoader {
  constructor() {
    this.components = [];
    this.initialized = false;

    // 🔧 DEBUG SCHALTER: true = Logs AN, false = Logs AUS
    this.debug = false;
  }

  /**
   * Helper für bedingte Logs
   */
  log(...args) {
    if (this.debug) console.log(...args);
  }
  error(...args) {
    if (this.debug) console.error(...args);
  }
  table(...args) {
    if (this.debug) console.table(...args);
  }

  /**
   * Registriere Components
   * @param {Array} components - Array mit Component-Definitionen
   */
  register(components) {
    this.components = components;
    return this;
  }

  /**
   * Starte das Laden der Components
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Gruppiere nach Priorität
    const grouped = {
      critical: this.components.filter(c => c.priority === "critical"),
      high: this.components.filter(c => c.priority === "high"),
      normal: this.components.filter(c => c.priority === "normal"),
      low: this.components.filter(c => c.priority === "low")
    };

    // 1. Critical sofort
    this.loadComponents(grouped.critical, "🚨 Loading critical components...");

    // 2. High nach DOM ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.loadComponents(grouped.high, "⚡ Loading high priority components...");
      });
    } else {
      this.loadComponents(grouped.high, "⚡ Loading high priority components...");
    }

    // 3. Normal nach window load
    window.addEventListener("load", () => {
      setTimeout(() => {
        this.loadComponents(grouped.normal, "📦 Loading normal priority components...");
      }, 100);
    });

    // 4. Low wenn Browser idle
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        this.loadComponents(grouped.low, "🐌 Loading low priority components...");
      });
    } else {
      setTimeout(() => {
        this.loadComponents(grouped.low, "🐌 Loading low priority components...");
      }, 2000);
    }

    // Setup dev helpers
    this.setupDevHelpers();
    return this;
  }

  /**
   * Lade eine Gruppe von Components
   */
  loadComponents(components, message) {
    if (components.length === 0) return;
    this.log(message);
    components.forEach(component => {
      try {
        component.init();
        this.log(`✅ ${component.name} initialized (${component.priority})`);
      } catch (error) {
        this.error(`❌ Failed to initialize ${component.name}:`, error);
      }
    });
  }

  /**
   * Setup Dynamic Content Handler
   */
  setupDynamicContentHandler() {
    const observer = new MutationObserver(mutations => {
      const hasNewButtons = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          return node.nodeType === 1 && (node.matches?.('a[class*="button"]') || node.querySelector?.('a[class*="button"]'));
        });
      });
      if (hasNewButtons && window.ButtonRipple?.reinitialize) {
        window.ButtonRipple.reinitialize();
      }
    });
    window.addEventListener("load", () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
    return this;
  }

  /**
   * Dev Helper Functions
   */
  setupDevHelpers() {
    // showComponentStats immer verfügbar, aber Logs nur wenn debug = true
    window.showComponentStats = () => {
      this.table(this.components.map(c => ({
        name: c.name,
        priority: c.priority
      })));
    };

    // Tipp nur in Dev-Umgebung
    if (window.location.hostname === "localhost" || window.location.hostname.includes("dev")) {
      this.log("💡 Tipp: Nutze window.showComponentStats() für Component Übersicht");
    }
  }

  /**
   * Debug Mode setzen
   */
  setDebug(enabled) {
    this.debug = enabled;
    return this;
  }
}

// Export Singleton Instance
const componentLoader = new ComponentLoader();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (componentLoader);

/***/ }),

/***/ "./src/sass/_index.scss":
/*!******************************!*\
  !*** ./src/sass/_index.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sass_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sass/_index.scss */ "./src/sass/_index.scss");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loader */ "./src/js/loader.js");
/* harmony import */ var _components_offsetScroll__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/offsetScroll */ "./src/js/components/offsetScroll.js");
/* harmony import */ var _components_scrollHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/scrollHandler */ "./src/js/components/scrollHandler.js");
/* harmony import */ var _components_updateDynamicAnchors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/updateDynamicAnchors */ "./src/js/components/updateDynamicAnchors.js");
/* harmony import */ var _components_smoothScroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/smoothScroll */ "./src/js/components/smoothScroll.js");
/* harmony import */ var _components_heroParallax__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/heroParallax */ "./src/js/components/heroParallax.js");
/* harmony import */ var _components_smartGrid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/smartGrid */ "./src/js/components/smartGrid.js");
/* harmony import */ var _components_buttonRipple__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/buttonRipple */ "./src/js/components/buttonRipple.js");


// Component Loader


// Component Imports








/**
 * Component Registry
 * Hier alle Components definieren mit ihrer Priorität
 */
const components = [
// Critical - Sofort laden
{
  name: "ScrollHandler",
  init: _components_scrollHandler__WEBPACK_IMPORTED_MODULE_3__["default"],
  priority: "critical"
}, {
  name: "SmoothScroll",
  init: _components_smoothScroll__WEBPACK_IMPORTED_MODULE_5__["default"],
  priority: "critical"
}, {
  name: "ButtonRipple",
  init: _components_buttonRipple__WEBPACK_IMPORTED_MODULE_8__["default"],
  priority: "critical"
},
// Normal - Nach Page Load
{
  name: "OffsetScroll",
  init: _components_offsetScroll__WEBPACK_IMPORTED_MODULE_2__["default"],
  priority: "normal"
}, {
  name: "UpdateDynamicAnchors",
  init: _components_updateDynamicAnchors__WEBPACK_IMPORTED_MODULE_4__["default"],
  priority: "normal"
},
// Low - Wenn Browser Zeit hat
{
  name: "Parallax",
  init: _components_heroParallax__WEBPACK_IMPORTED_MODULE_6__["default"],
  priority: "low"
}, {
  name: "SmartGrid",
  init: _components_smartGrid__WEBPACK_IMPORTED_MODULE_7__["default"],
  priority: "low"
}];

/**
 * Initialize App
 */
_loader__WEBPACK_IMPORTED_MODULE_1__["default"].register(components).init().setupDynamicContentHandler();
})();

/******/ })()
;
//# sourceMappingURL=index.js.map