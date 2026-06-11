'use strict'

class move { }

/**
 * 处理元素的拖拽逻辑
 * @param {HTMLElement} el - 被拖拽的 DOM 元素
 * @param {Object} ev - 事件上下文对象或组件实例，用于存储拖拽状态 (movi, movis)
 * @param {MouseEvent} e - 鼠标按下事件对象 (mousedown event)
 * @param {Object} binding - Vue 指令绑定对象 (如果是自定义指令)，包含 value 等信息
 * @param {number} [distance=30] - 拖拽时的水平偏移补偿距离，单位为像素
 * @param {string} [position='absolute'] - 元素的定位方式，默认为 absolute
 * @param {boolean} [isSaveMovement=false] - 是否保存移动后的位置信息，默认为 false
 */
move.draging = function (el, ev, e, binding, distance = 30, position = 'absolute', isSaveMovement = false, debug = false) {
  var disx = e.pageX - el.offsetLeft;
  var disy = e.pageY - el.offsetTop;
  var x = e.pageX - disx - distance + 'px'
  if (debug) console.log('x', distance)
  if (debug) console.log('y', e.pageY - disy)
  el.style.left = x
  el.style.top = e.pageY - disy + 'px'
  el.style.position = position
  el.style.zIndex = '999999'
  el.style.display = 'block !important'
  ev.movi = binding.value
  ev.movis = true
  document.onmousemove = function (e) {
    var x1 = e.pageX - disx - distance + 'px'
    if (debug) console.log('x1', distance)
    el.style.left = x1
    el.style.top = e.pageY - disy + 'px'
  }
  document.onmouseup = function () {
    document.onmousemove = document.onmouseup = null
    if (!isSaveMovement)el.style = ''
    ev.movis = false
  }
}

/**
 * 在列表中移动元素的位置（数组项交换/移动）
 * @param {number} movi - 源元素的索引位置 (from index)
 * @param {number} movto - 目标元素的索引位置 (to index)
 * @param {Array} list - 需要操作的目标数组
 * @param {boolean} movis - 拖拽状态标记，操作完成后重置为 false
 */
move.move = function (movi, movto, list, movis) {
  if (movi < movto) {
    movto -= 1
  }
  var c = JSON.parse(JSON.stringify(list[movi]))
  list.splice(movi, 1)
  list.splice(movto, 0, c)
  movis = false
}

module.exports = move
