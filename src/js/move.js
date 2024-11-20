'use strict'

class move { }
move.draging = function(el, ev, e, binding, distance = 30) {
  var disx = e.pageX - el.offsetLeft;
  var disy = e.pageY - el.offsetTop;
  var x = e.pageX - disx - distance + 'px'
  console.log('x', distance)
  el.style.left = x
  el.style.top = e.pageY - disy + 'px'
  el.style.position = 'absolute'
  el.style.zIndex = '10'
  el.style.display = 'block !important'
  ev.movi = binding.value
  ev.movis = true
  document.onmousemove = function (e) {
    var x1 = e.pageX - disx - distance + 'px'
    console.log('x1', distance)
    el.style.left = x1
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
