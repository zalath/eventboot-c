'use strict'

class move { }
move.draging = function(el, ev, e, binding) {
  var disx = e.pageX - el.offsetLeft;
  var disy = e.pageY - el.offsetTop;
  el.style.left = e.pageX - disx - 30 + 'px'
  el.style.top = e.pageY - disy + 'px'
  el.style.position = 'absolute'
  el.style.zIndex = '10'
  el.style.display = 'block !important'
  ev.movi = binding.value
  ev.movis = true
  document.onmousemove = function (e) {
    el.style.left = e.pageX - disx - 30 + 'px'
    el.style.top = e.pageY - disy + 'px'
  }
  document.onmouseup = function() {
    document.onmousemove = document.onmouseup = null
    el.style = ''
    ev.movis = false
  }
}

move.move = function(movi, movto, list, movis) {
  if (movi < movto) {
    movto -= 1
  }
  var c = JSON.parse(JSON.stringify(list[movi]))
  list.splice(movi, 1)
  list.splice(movto, 0, c)
  movis = false
}

module.exports = move
