export default defineEventHandler(async (event) => {
  throw new Error('throwing my special error')
})
