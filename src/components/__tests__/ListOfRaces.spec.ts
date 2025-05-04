import { describe, it, expect, vi, beforeEach } from 'vitest'
import PrimeVue from 'primevue/config'
import Select from 'primevue/select'
import { shallowMount } from '@vue/test-utils'
import NextToGoRaces from '../NextToGoRaces.vue'
import ListOfRaces from '../ListOfRaces.vue'
import { useCategoryStore } from '../../stores/useCategoryStore'
import racingApiResponse from './racing_api_response.json'
import categories from '../consts/categories'
import { setActivePinia, createPinia } from 'pinia'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(racingApiResponse),
  }),
)

describe('ListOfRaces', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it.each(categories)('fetches 5 races for the selected category: %s', async (category) => {
    const mockStore = useCategoryStore()
    const NextToGoRacesWrapper = shallowMount(NextToGoRaces, {
      global: {
        plugins: [PrimeVue],
      },
    })

    const select = NextToGoRacesWrapper.findComponent(Select)
    expect(select.exists()).toBe(true)

    // Simulate selecting this category
    await select.vm.$emit('update:modelValue', category)

    // Check if the store's selectedCategory was updated
    expect(mockStore.selectedCategory).toEqual(category)

    const wrapper = shallowMount(ListOfRaces, {
      global: {
        plugins: [PrimeVue],
      },
    })

    // Manually trigger fetchRaces and wait for it to complete
    await wrapper.vm.fetchRaces()
    await wrapper.vm.$nextTick()

    // Check that the races array contains exactly 5 items
    expect(wrapper.vm.races).toHaveLength(5)

    // Ensure all races belong to the selected category (if not "All categories")
    if (category.id) {
      expect(wrapper.vm.races.every((race) => race.category_id === category.id)).toBe(true)
    }
  })
})
