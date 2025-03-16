<script setup>
// Pagination state
const currentPage = ref(1)
const limit = ref(10)

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
const sessions = computed(() => data.value?.sessions || [])
const pagination = computed(() => data.value?.pagination || { page: 1, totalPages: 1 })

// Format date for display
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString()
}

// Navigation functions
function goToPage(page) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    currentPage.value = page
  }
}

function prevPage() {
  goToPage(currentPage.value - 1)
}

function nextPage() {
  goToPage(currentPage.value + 1)
}
</script>

<template>
  <div class="sessions-list">
    <h1>Recent Universal Sessions</h1>
    
    <div v-if="!sessions || sessions.length === 0" class="no-sessions">
      No sessions found.
    </div>
    
    <div v-else>
      <div class="sessions-grid">
        <div v-for="session in sessions" :key="session.id" class="session-card">
        <NuxtLink :to="`/gallery/${session.id}`" class="session-link">
          <div class="preview-container">
            <ScreenPreview 
              v-if="session.frames && session.frames.length > 0" 
              :screenPreviewHTML="session.frames[0].screenHTML" 
            />
            <div v-else class="no-preview">No preview available</div>
          </div>
          
          <div class="session-info">
            <div class="session-date">Created: {{ formatDate(session.createdAt) }}</div>
          </div>
        </NuxtLink>
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
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </span>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage >= pagination.totalPages"
          class="pagination-button"
        >
          Next
        </button>
      </div>
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
  height: 200px;
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
}

.session-date {
  font-size: 14px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
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
