// src/js/keybinding.js
let isListening = false;
export default {
  mounted() {
    if (!isListening) {
      window.addEventListener('keydown', this.handleEmacsMove, true);
      isListening = true;
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleEmacsMove, true);
    isListening = false
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
      }
      if (handled) {
        e.preventDefault();
      }
    },
    /**
     * 移动到当前行行首 (Ctrl+A)
     */
    moveToLineStart(el) {
      const text = el.value;
      const currentPos = el.selectionStart;

      // 1. 查找当前行前面的最后一个换行符，确定绝对行首
      const lastNewLine = text.lastIndexOf('\n', currentPos - 1);
      const lineStart = lastNewLine + 1;

      // 2. 查找当前行的下一个换行符，确定行尾（用于限制搜索范围）
      const nextNewLine = text.indexOf('\n', currentPos);
      const lineEnd = nextNewLine === -1 ? text.length : nextNewLine;

      // 3. 查找从行首开始的第一个非空白字符的位置
      const lineContent = text.substring(lineStart, lineEnd);
      const match = lineContent.match(/\S/); // 匹配第一个非空白字符
      let firstNonSpace = lineStart; // 默认如果没有非空字符，就停在行首

      if (match) {
        firstNonSpace = lineStart + match.index;
      }

      // 4. 切换逻辑
      let newPos = currentPos;

      if (currentPos === lineStart) {
        // 如果已经在绝对行首，跳转到第一个非空字符
        newPos = firstNonSpace;
      } else if (currentPos === firstNonSpace) {
        // 如果已经在第一个非空字符，跳转回绝对行首
        newPos = lineStart;
      } else {
        // 如果光标在中间或其他位置，第一次按跳转到第一个非空字符（智能行首）
        // 如果该行全是空格，firstNonSpace 等于 lineStart，也会跳过去
        newPos = firstNonSpace;
      }

      el.setSelectionRange(newPos, newPos);
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
        lineEnd += 1;
      } else {
        const killedText = text.substring(currentPos, lineEnd);
        this.$ipc.send('copy', killedText);
      }
      const newText = text.substring(0, currentPos) + text.substring(lineEnd);
      el.value = newText;
      el.setSelectionRange(currentPos, currentPos);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
