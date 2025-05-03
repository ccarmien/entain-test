import { defineStore } from 'pinia'
import { ref } from 'vue'
import type Category from '@/components/types/category.ts'

export const useCategoryStore = defineStore('category', () => {
  const selectedCategory = ref<Category | null>(null)

  const setCategory = (category: Category | null) => {
    selectedCategory.value = category
  }

  return {
    selectedCategory,
    setCategory,
  }
})
