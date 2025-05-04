<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useCategoryStore } from '../stores/useCategoryStore'
import { fetchRaces as fetchRacesService } from '../services/racingService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface Race {
  meeting_name: string
  race_number: number
  advertised_start: number
  category_id: string
}

const races = ref<Race[]>([])
const error = ref<string | null>(null)
const categoryStore = useCategoryStore() // To get the selected category from the store
const now = ref(Date.now()) // Reactive property to track the current time
const expiry = 60000 // 60 seconds after start is the expiry for races

const fetchRaces = async () => {
  try {
    races.value = await fetchRacesService(categoryStore.selectedCategory?.id, expiry)
  } catch (err: never) {
    error.value = err.message || 'Failed to fetch races'
  }
}

// Expose fetchRaces for testing
defineExpose({
  fetchRaces,
  races,
})

// Refetch races when the selected category changes
watch(() => categoryStore.selectedCategory, fetchRaces)

// Update the current time every second - we could've setup the refresh only when the first race expires instead of
// every second, but I have had issues in the past with tabbing out and minimizing the browser and the final interval
// not firing, so I decided to go with this approach since we have to update the countdown anyway.
onMounted(() => {
  fetchRaces()
  setInterval(() => {
    now.value = Date.now()
    if (races.value.length > 0) {
      const firstRace = races.value[0]
      const timeSinceExpired = now.value - firstRace.advertised_start
      if (timeSinceExpired > expiry) {
        // If the first race has been expired for more than 60 seconds
        fetchRaces()
      }
    }
  }, 1000)
})
</script>

<template>
  <div>
    <DataTable :value="races" stripedRows>
      <Column field="meeting_name" header="Meeting name"></Column>
      <Column field="race_number" header="Race number"></Column>
      <Column header="Countdown">
        <template #body="slotProps">
          {{
            (() => {
              const timeLeft = slotProps.data.advertised_start - now
              if (timeLeft <= 0) {
                return 'Race started'
              }
              const minutes = Math.floor(timeLeft / 60000)
              const seconds = Math.floor((timeLeft % 60000) / 1000)
                .toString()
                .padStart(2, '0') // Pad seconds with leading zero
              return `${minutes}:${seconds}`
            })()
          }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
