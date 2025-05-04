interface Race {
  meeting_name: string
  race_number: number
  advertised_start: number
  category_id: string
}

export const fetchRaces = async (
  selectedCategoryId: string | null,
  expiry: number,
): Promise<Race[]> => {
  try {
    /* This is how I would proceed if the API had pagination/skip, I couldn't manage to use a "skip" or "page" parameter so
    I had to resort to getting 60 races in the query in the hopes that I would get 5 races for each category when a user selects one

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

    // This is the solution with 60 count to circumvent no pagination API and display 5 races hopefully for each category
    const response = await fetch(
      'https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=60',
    )
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    const data = await response.json()
    const raceSummaries = data?.data?.race_summaries || {}

    return Object.values(raceSummaries)
      .map((race: any) => ({
        meeting_name: race.meeting_name,
        race_number: race.race_number,
        advertised_start: race.advertised_start.seconds * 1000, // Convert to milliseconds
        category_id: race.category_id,
      }))
      .filter((race) => {
        const timeSinceStart = Date.now() - race.advertised_start
        return (
          timeSinceStart <= expiry && // Ensure the race is not over by more than 60 seconds
          (selectedCategoryId ? race.category_id === selectedCategoryId : true)
        )
      })
      .sort((a, b) => a.advertised_start - b.advertised_start) // Sort by advertised_start ascending
      .slice(0, 5) // Take only the first 5 races
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch races')
  }
}
