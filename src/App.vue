<template>
  <UserPage></UserPage>
</template>

<script lang="ts" setup>
import UserPage from '@/views/UserPage.vue'
import { useDark } from '@vueuse/core'

useDark()
</script>

<style lang="scss" scoped></style>
