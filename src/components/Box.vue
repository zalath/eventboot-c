<template>
  <div>
    <div class="mainbody">
      <Ipbar />
      <Menu />
      <Task/>
      <Note/>
      <Starter />
      <Tool />
      <Conf v-show="isconf" />
      <keyfile v-show="iskeyfile"/>
      <knote />
      <Book />
      <Conffilelist/>
    </div>
    <Setapi />
    <popcheck />
  </div>
</template>
<script>
import Ipbar from './Ipbar';
import Task from './task/Task';
import Starter from './Starter';
import Conf from './Conf';
import Tool from './Tool';
import popcheck from './popup/check';
import Note from './note/Note';
import Setapi from './Dataapi';
import Menu from './Menu';
import keyfile from './keyfile/Keyfile';
import knote from './knote';
import Book from './book/Book';
import Conffilelist from './Conffilelist'
// import Watcher from './Watcher'
export default {
  components: {
    Ipbar,
    Menu,
    Task,
    Starter,
    Conf,
    Tool,
    popcheck,
    Note,
    Setapi,
    keyfile,
    knote,
    Book,
    Conffilelist
    // ,Watcher
  },
  name: 'Box',
  data: function () {
    return {
      page: 6,
      menu: [],
      isconf: false,
      iskeyfile: false
    };
  },
  created() {
    this.menu = this.$store.state.conf.menu;
    this.$bus.on('toggleconf', this.toggleconf);
    this.$bus.on('togglekeyfile', this.togglekeyfile);
    // this.$ipc.on('setpage', (event, e) => {
    //   this.setpage(e)
    // })
    this.$ipc.on('errmsg', (event, e) => {
      this.showerr(e);
    });
    this.$ipc.send('searchapi')
    this.$ipc.on('setapi', (event, e) => {
      console.log('seting api', e)
      this.$store.commit('setApi', e)
    })
  },
  methods: {
    // setpage: function(e) {
    //   this.page = e
    // },
    showerr: function (e) {
      alert(e);
    },
    toggleconf: function () {
      this.isconf = !this.isconf;
    },
    togglekeyfile: function () {
      this.iskeyfile = !this.iskeyfile;
    }
  }
};
</script>
<style lang="stylus" scoped>
div {
  color: red;
}
</style>
<style lang="stylus">
div::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #000;
}

div::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #000;
}

div::-webkit-scrollbar-thumb {
  background-color: red;
}

div::-webkit-scrollbar-corner {
  background-color: red;
}

div::-webkit-resizer {
  background-color: #000;
  border: solid 1px red;
}

pre::-webkit-scrollbar-track, textarea::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #000;
}

pre::-webkit-scrollbar, textarea::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #000;
}

pre::-webkit-scrollbar-thumb, textarea::-webkit-scrollbar-thumb {
  background-color: red;
}

textarea::-webkit-resizer {
  background-color: #000;
  border: none;
  border-right: solid 1px red;
  border-bottom: solid 1px red;
}

pre::-webkit-scrollbar-corner {
  background-color: #000;
  border: none;
}

button {
  cursor: pointer;
  margin-left: 0.5rem;
  border: none;
  outline: none;
  background: black;
  color: red;
  padding: 0.5rem 0.7rem;

  &:hover {
    clip-path: polygon(0% 0%, 80% 0%, 100% 20%, 100% 100%, 20% 100%, 0% 80%);
    background: red;
    color: white;
  }
}
.divider {
  clear both
  height 1px
  width 90%
  background-color red
  margin 30px auto
}

@font-face {
  font-family: 'FontRound'; /* 给字体起个名字 */
  src: url('~@/assets/font_round.ttf') format('truetype'); /* 使用 webpack 别名 @ 指向 src 目录 */
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'FontEn'; /* 给字体起个名字 */
  src: url('~@/assets/DejaVuSansMono-Bold.ttf') format('truetype'); /* 使用 webpack 别名 @ 指向 src 目录 */
  font-weight: normal;
  font-style: normal;
}
.mainbody
  font-family 'FontEn','FontRound'
textarea
  font-family 'FontEn','FontRound'
</style>
