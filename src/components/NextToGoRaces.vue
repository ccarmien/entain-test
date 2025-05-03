<script setup lang="ts">
import { useCategoryStore } from '../stores/useCategoryStore'
import Select from 'primevue/select'
import categories from './consts/categories.ts'

const categoryStore = useCategoryStore()
</script>

<template>
  <div class="greetings">
    <h1 class="purple">Next 'to go' races</h1>
    <h3>
      These are the next 5 races to go. If you wish to filter by category, use the dropdown below:
    </h3>
    <Select
      v-model="categoryStore.selectedCategory"
      :options="categories"
      optionLabel="name"
      placeholder="Select a Category"
      class="dropdown"
    />
  </div>
</template>
