<template>
  <div w-100vw h-100vh flex="~ center">
    <page/>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

html {
  font-size: calc(100vh / 150);
}
</style>
<script setup lang="ts">
import Page from './page.vue';
</script>
