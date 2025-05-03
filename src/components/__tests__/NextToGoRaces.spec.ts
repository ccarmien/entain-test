import { describe, it, expect, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import { shallowMount } from '@vue/test-utils'
import NextToGoRaces from '../NextToGoRaces.vue'
import Select from 'primevue/select'
import { useCategoryStore } from '../../stores/useCategoryStore'
import categories from '../consts/categories'

// Mock the category store
vi.mock('../../stores/useCategoryStore', () => ({
  useCategoryStore: vi.fn(() => ({
    selectedCategory: null,
    setSelectedCategory: vi.fn(),
  })),
}))

vi.mock('primevue/select', () => ({
  default: {
    template: '<div><slot></slot></div>',
    props: ['options', 'optionLabel', 'placeholder', 'modelValue'],
  },
}))

describe('NextToGoRaces', () => {
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
})
