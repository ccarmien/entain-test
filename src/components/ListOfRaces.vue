<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useCategoryStore } from '../stores/useCategoryStore'
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
    /* This is how I would proceed if the API had pagination/skip, I couldn't manage to use a "skip" or "page" parameter so
    I had to resort to getting 40 races in the query in the hopes that I would get 5 races for each category when a user selects one

    let allRaces: Race[] = []
    let page = 1

    while (allRaces.length < 5) {
      const response = await fetch(
        `https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=10&page=${page}`,
      )
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      const data = await response.json()
      const raceSummaries = data?.data?.race_summaries || {}

      const fetchedRaces = Object.values(raceSummaries)
        .map((race: never) => ({
          meeting_name: race.meeting_name,
          race_number: race.race_number,
          advertised_start: race.advertised_start.seconds * 1000, // Convert to milliseconds
          category_id: race.category_id,
        }))
        .filter((race) =>
          categoryStore.selectedCategory?.id
            ? race.category_id === categoryStore.selectedCategory.id
            : true,
        )
        .sort((a, b) => a.advertised_start - b.advertised_start)

      allRaces = [...allRaces, ...fetchedRaces]
      if (fetchedRaces.length === 0) break // Stop if no more races are available
      page++
    }
    */

    // This is the solution with 40 count to circumvent no pagination API and display 5 races hopefully for each category
    const response = await fetch(
      'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=40',
    )
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    const data = await response.json()
    const raceSummaries = data?.data?.race_summaries || {}
    races.value = Object.values(raceSummaries)
      .map((race: never) => ({
        meeting_name: race.meeting_name,
        race_number: race.race_number,
        advertised_start: race.advertised_start.seconds * 1000, // Convert to milliseconds
        category_id: race.category_id,
      }))
      .filter((race) => {
        const timeSinceStart = Date.now() - race.advertised_start
        return (
          timeSinceStart <= expiry && // Ensure the race is not over by more than 60 seconds
          (categoryStore.selectedCategory?.id // And the category is the selected one (or none)
            ? race.category_id === categoryStore.selectedCategory.id
            : true)
        )
      })
      .sort((a, b) => a.advertised_start - b.advertised_start) // Sort by advertised_start ascending
      .slice(0, 5) // Take only the first 5 races
  } catch (err: never) {
    error.value = err.message || 'Failed to fetch races'
  }
}

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
