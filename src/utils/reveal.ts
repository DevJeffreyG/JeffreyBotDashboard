import { nextTick, onMounted, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { useRoute } from 'vue-router'

export const revealWork = (): void => {
  const route = useRoute()
  const { y } = useScroll(window)
  let syncingRouteScroll = false

  const updateReveals = (): void => {
    const reveals = document.querySelectorAll<HTMLElement>('.reveal')

    for (const revElement of reveals) {
      const windowHeight = window.innerHeight
      const revealTop = revElement.getBoundingClientRect().top
      const revealPoint = revElement.classList.contains('late') ? 400 : 250

      if (revealTop < windowHeight - revealPoint) {
        revElement.classList.add('active')
      } else if (!revElement.classList.contains('keep')) {
        revElement.classList.remove('active')
      }
    }
  }

  onMounted(() => {
    updateReveals()
  })

  watch(
    () => route.fullPath,
    async () => {
      syncingRouteScroll = true

      await nextTick()

      if (window.scrollY === 0) {
        syncingRouteScroll = false
        updateReveals()
      }
    }
  )

  watch(y, () => {
    if (syncingRouteScroll && window.scrollY > 0) {
      return
    }

    syncingRouteScroll = false
    updateReveals()
  })
}