<template>
  <div class='partmap-container' ref='mapContainer'>
    <div class="part-titlebar" v-drag>
      <div class="part-titlebtn" @click="closePart">
        <i class="fa fa-times"></i>
      </div>
    </div>
    <div v-if='loading' class='loading'>加载中...</div>
    <svg ref='svg'></svg>
    <div class="menu">
      <div class="btn" v-for="(p, ind) in menuparts" :key="ind" @click="focus(p.id)">
        {{ p.name }}
      </div>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3';
import { mapState } from 'vuex/dist/vuex.cjs.js';
import move from '../../js/move';
import req from '../../js/req';
import data from '../../js/data';
export default {
  name: 'Partmap',
  props: {
    book: {},
    isshow: Boolean
  },
  data() {
    return {
      loading: false,
      simulation: null,
      width: 0,
      height: 0,
      isloaded: false,
      nodes: [],
      svgSel: null,
      zoomBehavior: null,
      g: null
    };
  },
  watch: {
    isshow(val) {
      if (val && !this.isloaded) {
        setTimeout(() => {
          this.resize();
          window.addEventListener('resize', this.resize);
          this.renderGraph();
          this.isloaded = true;
        }, 100);
      }
    }
  },
  computed: {
    ...mapState({
      parts: state => state.parts,
      relationtypelist: state => state.relationtypelist
    }),
    menuparts() {
      if (!this.parts[this.book.id]) return [];
      return Object.values(this.parts[this.book.id]).filter(p => p && p.type === 1);
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
    if (this.simulation) {
      this.simulation.stop();
    }
  },
  methods: {
    closePart() {
      this.$emit('close');
    },
    resize() {
      const container = this.$refs.mapContainer;
      if (container) {
        this.width = container.clientWidth;
        this.height = container.clientHeight;
      }
    },
    focus(id) {
      const node = this.nodes.find(n => n.id === id);
      if (!node || !this.svgSel || !this.zoomBehavior || !this.g) {
        return;
      }

      const container = this.$refs.mapContainer;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // 设置目标缩放比例
      const scale = 1.5;
      // 计算平移量，使节点居中
      const x = -node.x * scale + width / 2;
      const y = -node.y * scale + height / 2;

      // 执行平滑过渡
      this.svgSel.transition()
        .duration(750)
        .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(x, y).scale(scale));
    },
    async renderGraph() {
      await data.initBookParts(this.$store, this.book)
      const bookParts = this.parts[this.book.id];
      // 1. 准备节点数据 (Nodes)
      // 过滤掉无效部分，只取 type === 1 (人物/主要节点) 或其他你需要的类型
      const nodes = Object.values(bookParts)
        .filter(p => p && p.type === 1) // 根据需求调整过滤条件
        .map(p => ({
          id: p.id,
          name: p.name,
          pic: p.pic,
          type: p.type
        }));
      // 创建 ID 映射，方便快速查找
      const nodeMap = {};
      nodes.forEach(n => {
        nodeMap[n.id] = n
      });
      // 2. 准备连线数据 (Links)
      const links = [];
      var linksource = await req.post('bookpartrelationmap', { bookid: this.book.id })
      linksource.data.forEach(item => {
        links.push({
          source: item.p1,
          target: item.p2,
          relation: this.relationtypelist[this.book.id]?.[item.relationid]?.name,
          direction: item.direction
        });
      })
      this.drawD3(nodes, links);
    },
    openOne(id) {
      this.$emit('openOne', id)
    },
    drawD3(nodes, links) {
      const openOne = this.openOne;
      const svg = this.$refs.svg;
      if (!svg) return;

      this.nodes = nodes; // 保存节点

      d3.select(svg).selectAll('*').remove();
      const width = this.width;
      const height = this.height;

      this.svgSel = d3.select(svg) // 保存 svgSel
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .style('max-width', '100%')
        .style('height', 'auto');

      this.g = this.svgSel.append('g'); // 保存 g

      this.zoomBehavior = d3.zoom() // 保存 zoomBehavior
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          this.g.attr('transform', event.transform);
        });

      this.svgSel.call(this.zoomBehavior);
      // 初始化力导向模拟
      this.simulation = d3.forceSimulation(nodes)
        .force('link',
          d3.forceLink(links).id(d => d.id)
            .distance(120)
            .strength(0.2)
        ) // 引力
        .force('charge',
          d3.forceManyBody()
            .strength(-400)
            .distanceMin(30)
        ) // 斥力
        .force('collide', d3.forceCollide(d => d.r + 15)) // 防止重叠
        .force('center', d3.forceCenter(width / 2, height / 2))
      // 绘制连线
      const link = this.g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 2);
      // 绘制连线上的文字
      const linkText = this.g.append('g')
        .selectAll('text')
        .data(links)
        .join('text')
        .attr('font-size', 10)
        .attr('fill', '#ccc')
        .attr('text-anchor', 'middle')
        .attr('dy', -5)
        .text(d => d.relation);
      // 绘制节点
      const node = this.g.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 10)
        .attr('fill', '#ff0000') // 默认红色
        .on('click', (event, d) => {
          // 阻止事件冒泡，避免触发拖拽或其他SVG事件
          console.log('in click')
          event.stopPropagation();
          openOne(d.id)
          // vm.$emit('openOne', d.id)
          console.log('en dclick')
        })
        .call(drag(this.simulation));
      // 节点文字
      const nodeText = this.g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('font-size', 12)
        .attr('fill', '#fff')
        .attr('dx', 25)
        .attr('dy', 5)
        .text(d => d.name);
      // 更新位置
      this.simulation.on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);
        linkText
          .attr('x', d => (d.source.x + d.target.x) / 2)
          .attr('y', d => (d.source.y + d.target.y) / 2);
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
        nodeText
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      });
      // 拖拽函数
      function drag(simulation) {
        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        }
        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
        return d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended);
      }
    }
  },
  directives: {
    drag(el, binding) {
      el.onmousedown = function (e) {
        var elv = el
        var ev = binding.instance
        el = el.parentNode
        move.draging(el, ev, e, binding, 0, 'fixed', true)
        el = elv
      }
    }
  }
};
</script>
<style lang='stylus' scoped>
.partmap-container
  width 80%
  height 80%
  background-color #000
  border 1px solid red
  overflow hidden
  position fixed
  left 50%
  top 50%
  transform translate(-50%, -50%)
  z-index 9999
.loading
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  color white
svg
  width 100%
  height 100%
.menu
  position fixed
  top 50%
  left 0
  height 70%
  transform translateY(-50%)
  overflow-y auto
  scrollbar-width none
  background linear-gradient(to right, rgba(22,22,22,0.8), rgba(0, 0, 0, 0))
  &::-webkit-scrollbar {
    display none
  }
  .btn
    padding 10px
    cursor pointer
    &:hover
      background linear-gradient(to right, #ff0000, rgba(0, 0, 0, 0))
      color white
</style>
<style lang="stylus" src='../../css/cyber.styl' scoped></style>
<style lang="stylus" src='../../css/bookpart.styl' scoped></style>
