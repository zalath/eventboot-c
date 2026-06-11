// src/js/keybinding.js
export default {
  mounted() {
    // 使用 capture: true 确保在大多数其他监听器之前捕获事件
    window.addEventListener('keydown', this.handleEmacsMove, true);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleEmacsMove, true);
  },
  methods: {
    /**
     * 主处理函数：拦截特定的 Ctrl 组合键
     */
    handleEmacsMove(e) {
      // 只在 textarea 或 input 元素中生效
      const target = e.target;
      if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') {
        return;
      }
      // 忽略带有 Alt 或 Meta (Command) 键的组合，只处理 Ctrl
      if (!e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }
      const key = e.key.toLowerCase();
      let handled = false;
      switch (key) {
      case 'p': // Up
        this.moveCursorVertical(target, -1);
        handled = true;
        break;
      case 'n': // Down
        this.moveCursorVertical(target, 1);
        handled = true;
        break;
      case 'b': // Left
        this.moveCursorHorizontal(target, -1);
        handled = true;
        break;
      case 'f': // Right
        this.moveCursorHorizontal(target, 1);
        handled = true;
        break;
      case 'a': // Move to beginning of line
        this.moveToLineStart(target);
        handled = true;
        break;
      case 'e': // Move to end of line
        this.moveToLineEnd(target);
        handled = true;
        break;
      case 'k': // Kill (delete) to end of line
        this.killLine(target);
        handled = true;
        break;
      case 'y': // Yank (paste) from kill ring
        this.yank(target);
        handled = true;
        break;
      }
      if (handled) {
        e.preventDefault();
      }
    },
    /**
     * 水平移动光标 (Left/Right)
     * @param {HTMLElement} el - textarea/input 元素
     * @param {Number} direction - -1 为左, 1 为右
     */
    moveCursorHorizontal(el, direction) {
      const pos = el.selectionStart;
      const newPos = pos + direction;
      // 边界检查
      if (newPos >= 0 && newPos <= el.value.length) {
        el.setSelectionRange(newPos, newPos);
      }
    },
    /**
     * 垂直移动光标 (Up/Down)
     * @param {HTMLElement} el - textarea/input 元素
     * @param {Number} direction - -1 为上, 1 为下
     */
    moveCursorVertical(el, direction) {
      const text = el.value;
      const currentPos = el.selectionStart;
      const lineStart = text.lastIndexOf('\n', currentPos - 1) + 1;
      let lineEnd = text.indexOf('\n', currentPos);
      if (lineEnd === -1) lineEnd = text.length;
      const colIndex = currentPos - lineStart;
      let targetLineStart, targetLineEnd;
      if (direction === -1) { // Up
        const prevLineBreak = text.lastIndexOf('\n', lineStart - 2);
        if (prevLineBreak === -1) {
          return;
        }
        targetLineStart = prevLineBreak + 1;
        targetLineEnd = lineStart - 1;
      } else { // Down
        const nextLineBreak = text.indexOf('\n', lineEnd);
        if (nextLineBreak === -1) {
          return;
        }
        targetLineStart = nextLineBreak + 1;
        targetLineEnd = text.indexOf('\n', targetLineStart);
        if (targetLineEnd === -1) targetLineEnd = text.length;
      }
      let newPos = targetLineStart + colIndex;
      if (newPos > targetLineEnd) {
        newPos = targetLineEnd;
      }
      el.setSelectionRange(newPos, newPos);
    },
    /**
     * 移动到当前行行首 (Ctrl+A)
     */
    moveToLineStart(el) {
      const text = el.value;
      const currentPos = el.selectionStart;
      // 查找当前行前面的最后一个换行符
      const lineStart = text.lastIndexOf('\n', currentPos - 1) + 1;
      el.setSelectionRange(lineStart, lineStart);
    },
    /**
     * 移动到当前行行尾 (Ctrl+E)
     */
    moveToLineEnd(el) {
      const text = el.value;
      const currentPos = el.selectionStart;
      // 查找当前行的换行符
      const lineEnd = text.indexOf('\n', currentPos);
      el.setSelectionRange(lineEnd, lineEnd);
    },
    /**
     * 删除从光标处到行尾的内容 (Ctrl+K)
     */
    killLine(el) {
      const text = el.value;
      const currentPos = el.selectionStart;
      let lineEnd = text.indexOf('\n', currentPos);
      if (lineEnd === -1) {
        lineEnd = text.length;
      }
      if (currentPos === lineEnd) {
        return;
      }
      const killedText = text.substring(currentPos, lineEnd);
      this.$store.commit('setKillRing', killedText);

      const newText = text.substring(0, currentPos) + text.substring(lineEnd);
      el.value = newText;
      el.setSelectionRange(currentPos, currentPos);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    /**
     * 粘贴上次删除的内容 (Ctrl+Y)
     * @param {HTMLElement} el - textarea/input 元素
     */
    yank(el) {
      const text = el.value;
      const pos = el.selectionStart;
      const endPos = el.selectionEnd;

      const killedText = this.$store.state.killRing;
      // 在光标处插入内容
      const newText = text.substring(0, pos) + killedText + text.substring(endPos);

      el.value = newText;

      // 移动光标到插入内容的末尾
      const newPos = pos + killedText.length;
      el.setSelectionRange(newPos, newPos);

      // 触发 input 事件以通知 Vue 或其他监听器值已更改
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
