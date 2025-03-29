<script setup>
definePageMeta({ ssr: false })

// Get route and router
const route = useRoute()
const router = useRouter()

// Use query parameters for pagination
const limit = ref(9)

// Create a computed property for currentPage that reads/writes to the URL
const currentPage = computed({
  get: () => parseInt(route.query.page || '1', 10),
  set: (value) => {
    router.push({
      query: {
        ...route.query,
        page: value.toString()
      }
    })
  }
})

globalThis.debug ||= {}

// Reactive fetch that updates when page changes
const { data, refresh } = useAsyncData(
  () => $fetch('/api/universal-session', {
    query: {
      page: currentPage.value,
      limit: limit.value
    }
  }),
  {
    watch: [currentPage, limit]
  }
)

// Computed properties for pagination
const sessions = computed(() => {
  globalThis.debug.sessionsData = data
  console.log("data.value", data.value)
  console.log("data.value.sessions", data.value?.sessions)

  return data.value?.sessions || []
})

// Format date for display
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Navigation functions
function goToPage(page) {
  if (page >= 1) {
    currentPage.value = page
  }
}

function prevPage() {
  goToPage(currentPage.value - 1)
}

function nextPage() {
  goToPage(currentPage.value + 1)
}

const scaleOfPreviews = 3
</script>

<template>
  <div class="sessions-list" style='padding: 0px 40px;'>
    <div style="display: flex; align-items: flex-end; padding: 10px 0px;">
      <div style="flex-grow: 1">
        <span style="font-weight: bold; font-size: 125%">Instant Replay Gallery</span><br/>
        <div style="flex-grow: 1">
          <a href="/">Back to Universal</a>
        </div>
      </div>

      <!-- Pagination controls -->
      <div class="pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage <= 1"
          class="pagination-button"
        >
          Previous
        </button>
        
        <span class="pagination-info">
          Page {{ currentPage }}
        </span>
        
        <button 
          @click="nextPage" 
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
    


    <div class="sessions-grid">
      <div v-if="!sessions || sessions.length === 0" class="no-sessions">
        You've reached the last page.
      </div>
      <div v-else v-for="session in sessions" :key="session.id" class="session-card">
      <NuxtLink :to="`/gallery/${session.id}`" class="session-link">
        <div class="preview-container">
          <ScreenPreview 
            :scale="scaleOfPreviews"
            :screenPreviewHTML="session.thumbnailFrame.screenHTML" 
          />
        </div>
        
        <div class="session-info">
          <div class="session-date">{{ formatDate(session.createdAt) }}</div>
          <div class="session-n-frames">{{ session.numFrames }} frames</div>
        </div>
      </NuxtLink>
      </div>
    </div>
      
    <!-- Pagination controls -->
    <div class="pagination" style="margin-top: 20px;">
      <button 
        @click="prevPage" 
        :disabled="currentPage <= 1"
        class="pagination-button"
      >
        Previous
      </button>
      
      <span class="pagination-info">
        Page {{ currentPage }}
      </span>
      
      <button 
        @click="nextPage" 
        class="pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.sessions-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.no-sessions {
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1320px;
}

.session-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.session-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.session-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.preview-container {
  
  overflow: hidden;
  background-color: #f5f5f5;
}

.no-preview {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.session-info {
  padding: 10px;
  display: flex;
}

.session-date {
  font-size: 14px;
  color: #666;
  flex-grow: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 15px;
  font-size: 14px;
}
</style>
