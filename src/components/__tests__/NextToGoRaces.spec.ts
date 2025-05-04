import { describe, it, expect, vi, beforeEach } from 'vitest'
import PrimeVue from 'primevue/config'
import { shallowMount } from '@vue/test-utils'
import NextToGoRaces from '../NextToGoRaces.vue'
import Select from 'primevue/select'
import { useCategoryStore } from '../../stores/useCategoryStore'
import categories from '../consts/categories'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('primevue/select', () => ({
  default: {
    template: '<div><slot></slot></div>',
    props: ['options', 'optionLabel', 'placeholder', 'modelValue'],
  },
}))

describe('NextToGoRaces', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    const wrapper = shallowMount(NextToGoRaces, {
      global: {
        plugins: [PrimeVue],
      },
    })
    expect(wrapper.text()).toContain("Next 'to go' races")
    expect(wrapper.text()).toContain(
      'These are the next 5 races to go. If you wish to filter by category, use the dropdown below:',
    )
  })

  it('renders the Select component with the right categories options', () => {
    const wrapper = shallowMount(NextToGoRaces, {
      global: {
        plugins: [PrimeVue],
      },
    })

    const select = wrapper.findComponent(Select)
    expect(select.exists()).toBe(true)

    const options = select.props('options')
    expect(options).toHaveLength(4)
    expect(options).toEqual(categories)
  })

  it('has the correct default selected category', () => {
    const mockStore = useCategoryStore()
    const wrapper = shallowMount(NextToGoRaces, {
      global: {
        plugins: [PrimeVue],
      },
    })

    const select = wrapper.findComponent(Select)
    expect(select.props('modelValue')).toBe(mockStore.selectedCategory)
    expect(mockStore.selectedCategory).toBe(null) // Default value
  })

  it.each(categories)('stores the selected category in the store: %s', async (category) => {
    const mockStore = useCategoryStore()
    const wrapper = shallowMount(NextToGoRaces, {
      global: {
        plugins: [PrimeVue],
      },
    })

    const select = wrapper.findComponent(Select)
    expect(select.exists()).toBe(true)

    // Simulate selecting a category
    await select.vm.$emit('update:modelValue', category)

    // Check if the store's selectedCategory was updated
    expect(mockStore.selectedCategory).toEqual(category)
  })
})
