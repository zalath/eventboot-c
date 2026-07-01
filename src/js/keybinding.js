// src/js/keybinding.js
let isListening = false;
let handlerInstance = null; // 保存当前处理实例的引用

export default {
  data() {
    return {
      waitingForSecondKey: false, // 是否等待第二个按键（改为实例属性）
      waitingTimeout: null // 等待超时定时器
    };
  },
  mounted() {
    if (!isListening) {
      window.addEventListener('keydown', this.handleEmacsMove, true);
      isListening = true;
    }
    handlerInstance = this;
  },
  beforeUnmount() {
    if (isListening && handlerInstance === this) {
      window.removeEventListener('keydown', this.handleEmacsMove, true);
      isListening = false;
      handlerInstance = null;
    }
    if (this.waitingTimeout) {
      clearTimeout(this.waitingTimeout);
      this.waitingTimeout = null;
    }
    this.waitingForSecondKey = false;
  },
  methods: {
    /**
     * 主处理函数：拦截特定的 Ctrl 组合键
     */
    handleEmacsMove(e) {
      // 如果事件已经被其他处理器阻止，跳过处理
      if (e.defaultPrevented) {
        return;
      }

      // 只在 textarea 或 input 元素中生效
      const target = e.target;
      if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') {
        return;
      }

      const key = e.key.toLowerCase();
      let handled = false;

      // 如果正在等待第二个按键
      if (this.waitingForSecondKey) {
        this.cancelWaitingForSecondKey();
        handled = this.handleSecondKey(e, key, target);
        if (handled) {
          e.preventDefault();
          e.stopImmediatePropagation();
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
      case 'backspace': // Backspace (删除到上一个回车或者空格)
        this.deleteToLineStart(target);
        handled = true;
        break;
      case 'x':
        // 等待后面的输入，进行进一步的命令匹配，比如 Ctrl+X Ctrl+S
        // 后面的命令可能加ctrl可能不加，要分开处理
        this.startWaitingForSecondKey();
        handled = true;
        break;
      case 'w':
        // 等待后面的输入，进行进一步的命令匹配，比如 Ctrl+X Ctrl+S
        // 后面的命令可能加ctrl可能不加，要分开处理
        this.cut(target);
        handled = true;
        break;
      }

      if (handled) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    /**
     * 开始等待第二个按键（Ctrl+X后的组合键）
     */
    startWaitingForSecondKey() {
      this.waitingForSecondKey = true;
      // 设置超时，1500ms内没有按下第二个键则取消等待
      if (this.waitingTimeout) {
        clearTimeout(this.waitingTimeout);
      }
      this.waitingTimeout = setTimeout(() => {
        this.cancelWaitingForSecondKey();
      }, 400);
    },
    /**
     * 取消等待第二个按键
     */
    cancelWaitingForSecondKey() {
      this.waitingForSecondKey = false;
      if (this.waitingTimeout) {
        clearTimeout(this.waitingTimeout);
        this.waitingTimeout = null;
      }
    },
    /**
     * 处理第二个按键（Ctrl+X后的组合键）
     */
    handleSecondKey(e, key, target) {
      let handled = false;

      // 优先判断是否带Ctrl的组合（Ctrl+X Ctrl+S）
      if (e.ctrlKey && key === 's') {
        // Ctrl+X Ctrl+S: 保存
        e.preventDefault();
        this.triggerSave(target);
        handled = true;
      } else if (e.ctrlKey && key === 'c') {
        // Ctrl+X Ctrl+C: 关闭/退出
        e.preventDefault();
        this.triggerClose(target);
        handled = true;
      } else if (key === 's' && !e.ctrlKey) {
        // Ctrl+X S (不加Ctrl): 保存
        // 注意：此时必须阻止默认行为，防止浏览器保存网页
        e.preventDefault();
        this.triggerSave(target);
        handled = true;
      } else {
        // 其他按键：不做处理
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
     * Emacs风格：第一次删除到行尾（不删换行符），如果光标在换行符处则删除换行符（合并下一行）
     * 使用document.execCommand实现原生撤销支持
     */
    killLine(el) {
      const text = el.value;
      const currentPos = el.selectionStart;
      let deleteEnd;

      // 查找从光标位置开始的下一个换行符
      const nextNewLine = text.indexOf('\n', currentPos);

      if (nextNewLine === -1) {
        // 最后一行，没有换行符，删除到文本末尾
        deleteEnd = text.length;
      } else if (currentPos === nextNewLine) {
        // 光标正好在换行符位置，删除换行符（合并下一行）
        deleteEnd = nextNewLine + 1;
      } else {
        // 删除从光标到换行符之前的内容（不删除换行符）
        deleteEnd = nextNewLine;
      }

      // 边界保护：防止越界
      if (deleteEnd > text.length) {
        deleteEnd = text.length;
      }

      // 保存被删除的内容到剪贴板
      const killedText = text.substring(currentPos, deleteEnd);
      if (killedText.length > 0) {
        this.$ipc.send('copy', killedText);
      }

      // 使用execCommand实现删除，自动加入浏览器撤销队列
      // @ts-expect-error document.execCommand is deprecated but remains the only way to integrate with native undo
      el.focus();
      el.setSelectionRange(currentPos, deleteEnd);
      document.execCommand('delete');

      // 使用 $nextTick 在 Vue 重新渲染后恢复光标位置
      this.$nextTick(() => {
        el.setSelectionRange(currentPos, currentPos);
      });
    },
    /**
     * 删除从光标处到行首的内容 (Ctrl+Backspace)
     * 使用document.execCommand实现原生撤销支持
     */
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
      const delText = text.substring(lineStart, currentPos);
      this.$ipc.send('copy', delText);

      // 使用execCommand实现删除，自动加入浏览器撤销队列
      // @ts-expect-error document.execCommand is deprecated but remains the only way to integrate with native undo
      el.focus();
      el.setSelectionRange(lineStart, currentPos);
      document.execCommand('delete');

      // 使用 $nextTick 在 Vue 重新渲染后恢复光标位置
      this.$nextTick(() => {
        el.setSelectionRange(lineStart, lineStart);
      });
    },
    /**
     * 剪切选中的内容 (Ctrl+W)
     * 使用document.execCommand实现原生撤销支持
     */
    cut(el) {
      const text = el.value;
      const currentPos = el.selectionStart;
      const selectionEnd = el.selectionEnd;
      const selectedText = text.substring(currentPos, selectionEnd);

      // 如果没有选中内容，不做处理
      if (currentPos === selectionEnd) {
        return;
      }

      this.$ipc.send('copy', selectedText);

      // 使用execCommand实现剪切，自动加入浏览器撤销队列
      // @ts-expect-error document.execCommand is deprecated but remains the only way to integrate with native undo
      el.focus();
      el.setSelectionRange(currentPos, selectionEnd);
      document.execCommand('delete');

      // 使用 $nextTick 在 Vue 重新渲染后恢复光标位置
      this.$nextTick(() => {
        el.setSelectionRange(currentPos, currentPos);
      });
    }
  }
}
