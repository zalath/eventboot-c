// src/js/keybinding.js
let isListening = false;
let waitingForSecondKey = false; // 是否等待第二个按键
let waitingTimeout = null; // 等待超时定时器

export default {
  mounted() {
    if (!isListening) {
      window.addEventListener('keydown', this.handleEmacsMove, true);
      isListening = true;
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleEmacsMove, true);
    isListening = false;
    if (waitingTimeout) {
      clearTimeout(waitingTimeout);
      waitingTimeout = null;
    }
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

      const key = e.key.toLowerCase();
      let handled = false;

      // 如果正在等待第二个按键
      if (waitingForSecondKey) {
        handled = this.handleSecondKey(e, key, target);
        if (handled) {
          e.preventDefault();
        }
        return;
      }

      // 忽略带有 Alt 或 Meta (Command) 键的组合，只处理 Ctrl
      if (!e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

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
      case 'backspace':// Backspace (删除到上一个回车或者空格)
        this.deleteToLineStart(target);
        handled = true;
        break;
      case 'x':
        // 等待后面的输入，进行进一步的命令匹配，比如 Ctrl+X Ctrl+S
        // 后面的命令可能加ctrl可能不加，要分开处理
        this.startWaitingForSecondKey();
        handled = true;
        break;
      }
      if (handled) {
        e.preventDefault();
      }
    },
    /**
     * 开始等待第二个按键（Ctrl+X后的组合键）
     */
    startWaitingForSecondKey() {
      waitingForSecondKey = true;
      // 设置超时，2秒内没有按下第二个键则取消等待
      if (waitingTimeout) {
        clearTimeout(waitingTimeout);
      }
      waitingTimeout = setTimeout(() => {
        waitingForSecondKey = false;
        waitingTimeout = null;
      }, 200);
    },
    /**
     * 处理第二个按键（Ctrl+X后的组合键）
     */
    handleSecondKey(e, key, target) {
      // 清除等待状态
      waitingForSecondKey = false;
      if (waitingTimeout) {
        clearTimeout(waitingTimeout);
        waitingTimeout = null;
      }

      let handled = false;

      // Ctrl+X Ctrl+S: 保存
      if (e.ctrlKey && key === 's') {
        this.triggerSave(target);
        handled = true;
      } else if (e.ctrlKey && key === 'c') {
        // Ctrl+X Ctrl+C: 关闭/退出
        this.triggerClose(target);
        handled = true;
      } else if (!e.ctrlKey && key === 's') {
        // Ctrl+X S (不加Ctrl): 保存
        this.triggerSave(target);
        handled = true;
      } else {
        // 其他按键：取消等待，不做处理
        handled = false;
      }

      return handled;
    },
    /**
     * 触发保存事件
     */
    triggerSave(target) {
      // 触发自定义事件，让组件监听并处理
      const saveEvent = new CustomEvent('emacs-save', {
        bubbles: true,
        detail: { target }
      });
      target.dispatchEvent(saveEvent);
    },
    /**
     * 触发关闭事件
     */
    triggerClose(target) {
      const closeEvent = new CustomEvent('emacs-close', {
        bubbles: true,
        detail: { target }
      });
      target.dispatchEvent(closeEvent);
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
    },
    deleteToLineStart(el) {
      const text = el.value;
      const currentPos = el.selectionStart;

      // 如果光标在行首，不删除任何内容
      if (currentPos === 0) {
        return;
      }
      // 从当前位置删除到本行行首
      const lastNewLine = text.lastIndexOf('\n', currentPos - 1);
      const lineStart = lastNewLine + 1;
      const newText = text.substring(0, lineStart) + text.substring(currentPos);
      el.value = newText;
      el.setSelectionRange(lineStart, lineStart);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
