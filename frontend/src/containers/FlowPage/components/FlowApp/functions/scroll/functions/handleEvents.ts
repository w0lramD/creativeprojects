import normalizeWheel from 'normalize-wheel';

import { scrollObj, ScrollMode } from '../scroll';
import { MOMENTUM_CARRY, MOUSE_MULTIPLIER } from '../constants';
import { applyScroll } from './applyScroll';
import { appObj } from '../../app';
import { getProgressValues } from './getProgressValues';

export const handleEvents = () => {
  const onTouchDown = (event: TouchEvent & PointerEvent) => {
    scrollObj.isTouching = true;
    scrollObj.useMomentum = false;
    scrollObj.lastTouchX = event.touches
      ? event.touches[0].clientX
      : event.clientX;
    scrollObj.lastTouchY = event.touches
      ? event.touches[0].clientY
      : event.clientY;
  };

  const onTouchMove = (event: TouchEvent & PointerEvent) => {
    if (!scrollObj.isTouching) {
      return;
    }

    const touchX = event.touches ? event.touches[0].clientX : event.clientX;
    const touchY = event.touches ? event.touches[0].clientY : event.clientY;

    const deltaX =
      (touchX - scrollObj.lastTouchX) * (event.touches ? 1 : MOUSE_MULTIPLIER);
    const deltaY =
      (touchY - scrollObj.lastTouchY) * (event.touches ? 1 : MOUSE_MULTIPLIER);

    scrollObj.lastTouchX = touchX;
    scrollObj.lastTouchY = touchY;

    scrollObj.touchMomentum *= MOMENTUM_CARRY;

    switch (scrollObj.scrollMode) {
      case ScrollMode.VERTICAL:
        scrollObj.touchMomentum += deltaY;
        break;
      case ScrollMode.HORIZONTAL:
        scrollObj.touchMomentum += deltaX;
        break;
      default:
        throw new Error('Invalid timeline mode');
    }

    applyScroll({ horizontalAmountPx: deltaX, verticalAmountPx: deltaY });
  };

  const onTouchUp = () => {
    scrollObj.isTouching = false;
    scrollObj.useMomentum = true;
  };

  const onWheel = event => {
    scrollObj.useMomentum = false;

    const { pixelY } = normalizeWheel(event);

    applyScroll({
      horizontalAmountPx: -pixelY,
      verticalAmountPx: -pixelY,
    });
  };

  const onResize = () => {
    scrollObj.TWEEN_GROUP_SEEK && scrollObj.TWEEN_GROUP_SEEK.removeAll();
    scrollObj.useMomentum = false;

    scrollObj.contentHeight = appObj.scrollWrapperSizes.height;
    scrollObj.contentWidth = appObj.scrollWrapperSizes.width;

    scrollObj.windowHeight = appObj.sizes.height;
    scrollObj.windowWidth = appObj.sizes.width;

    let currentOffset;

    switch (scrollObj.scrollMode) {
      case ScrollMode.VERTICAL:
        currentOffset = getProgressValues().currentOffset;
        scrollObj.lastX = 0;
        scrollObj.currentX = 0;
        scrollObj.targetX = 0;

        scrollObj.lastY = currentOffset;
        scrollObj.currentY = currentOffset;
        scrollObj.targetY = currentOffset;

        break;
      case ScrollMode.HORIZONTAL:
        currentOffset = getProgressValues().currentOffset;
        scrollObj.lastY = 0;
        scrollObj.currentY = 0;
        scrollObj.targetY = 0;

        scrollObj.lastX = currentOffset;
        scrollObj.currentX = currentOffset;
        scrollObj.targetX = currentOffset;

        break;
      default:
        throw new Error('Invalid timeline mode');
    }
  };

  const init = () => {
    window.addEventListener('mousewheel', onWheel);
    window.addEventListener('wheel', onWheel);

    window.addEventListener('mousedown', onTouchDown);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchUp);

    window.addEventListener('touchstart', onTouchDown);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchUp);

    window.addEventListener('resize', onResize);

    onResize();
  };

  return {
    init,
  };
};
