import { defineStore } from 'pinia'
import type { DockyardTemplate } from '~/types/templates/dockyard'

export const useTemplatesStore = defineStore({
  id: 'templatesStore',
  state: () => ({
    templates: [] as DockyardTemplate[],
    loading: [] as string[],
  }),
  actions: {
    async startLoading(name: string) { this.loading.push(name) },
    async stopLoading(name: string) { this.loading = this.loading.filter((item) => item !== name) },
    async fetchTemplates() {
      this.startLoading('templates')
      const { error, data } = await useFetch<DockyardTemplate[]>('/api/templates', { lazy: false })
      data.value ? this.templates = data.value : console.log(data.value)
      if (error.value) console.error(error.value)
      this.stopLoading('templates')
      return { error, data }
    },
    async addTemplate(url: string, name: string, title?: string) {
      this.startLoading('templates')
      const { error, data } = await useFetch<DockyardTemplate>('/api/templates', { method: 'POST', body: { url, name, title } })
      if (error.value) console.error(error.value)
      data.value ? this.templates.push(data.value) : console.log(data.value)
      this.stopLoading('templates')
      return { error, data }
    }
  }
})
