import { addTemplateSchema } from '~/types/templates/dockyard'

export default defineEventHandler(async (event) => {
  const { url, name, title } = await readValidatedBody(event, addTemplateSchema.parse)
  return await addTemplate({ url, name, title })
})