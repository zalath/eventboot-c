<template>
  <div id="main">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style lang="stylus">
#main
  background-color black
  position absolute
  left 0px
  right 0px
  top 0px
  bottom 0px
  overflow auto
#nav a
  color white !important
.cp
  cursor pointer
</style>
