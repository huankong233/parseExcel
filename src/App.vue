<template>
  <UserPage></UserPage>
</template>

<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import UserPage from '@/views/UserPage.vue'

useDark()
</script>

<style lang="scss" scoped></style>
