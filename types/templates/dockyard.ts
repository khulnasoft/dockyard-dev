import { z } from "zod"
import { capAddSchema, capDropSchema, keyValueSchema, nameValueSchema, optionalNameValueSchema } from "../shared"



export const addTemplateSchema = z.object({
  url: z.string(),
  name: z.string(),
  title: z.string().optional()
})

export type AddTemplate = z.infer<typeof addTemplateSchema>

export const dockyardTemplateLinkSchema = z.object({
  url: z.string(),
  text: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional()
})

export const dockyardTemplateAuthorSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  avatar: z.string().optional()
})

export const dockyardV2TemplatePortValueSchema = z.object({
  host: z.string().optional(),
  container: z.string().optional(),
  protocol: z.union([z.literal("tcp"), z.literal("udp")]).optional(),
  description: z.string().optional(),
  unchangable: z
    .union([
      z.boolean(),
      z.array(
        z.union([
          z.literal("host"),
          z.literal("container"),
          z.literal("protocol")
        ])
      )
    ])
    .optional()
})

export const dockyardV2TemplatePortSchema = z.record(dockyardV2TemplatePortValueSchema)
export type DockyardV2TemplatePort = z.infer<typeof dockyardV2TemplatePortSchema>

export const dockyardV1TemplatePortSchema = z.union([z.string(), z.record(z.string())])
export type DockyardV1TemplatePort = z.infer<typeof dockyardV1TemplatePortSchema>

export const dockyardV1TemplatePortsSchema = z.array(z.union([dockyardV1TemplatePortSchema, z.string()]))
export type dockyardV1TemplatePorts = z.infer<typeof dockyardV1TemplatePortsSchema>

export const dockyardTemplateVolumeSchema = z.object({
  container: z.string(),
  bind: z.string().optional(),
  readonly: z.boolean().optional(),
  label: z.string().optional()
})

export const dockyardTemplateLabelsSchema = z.object({
  name: z.string().optional(),
  value: z.string().optional()
})

export const dockyardTemplateEnvironmentSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  default: z.string().optional(),
  preset: z.boolean().optional(),
  set: z.string().optional(),
  value: z.string().optional()
})

export const portainerTemplateStackSchema = z.object({
  url: z.string(),
  stackfile: z.string()
})

export const portainerTemplateAccessControlSchema = z.object({
  enabled: z.boolean()
})

export const devicesSchema = z.object({
  host: z.string().optional(),
  container: z.string().optional(),
  permissions: z.union([
    z.literal('r'),
    z.literal('w'),
    z.literal('m'),
    z.literal('mw'),
    z.literal('rm'),
    z.literal('rwm'),
    z.literal('rw'),
  ]).optional()
})

export const dockyardV1TemplateSchema = z.object({
  type: z.string().or(z.number()).optional(),
  title: z.string(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  logo: z.string().optional(),
  note: z.string().optional(),
  image: z.string(),
  registry: z.string().optional(),
  administrator_only: z.boolean().optional(),
  access_control: portainerTemplateAccessControlSchema.optional(),
  command: z.string().optional(),
  network: z.string().optional(),
  repository: portainerTemplateStackSchema.optional(),
  categories: z.array(z.string()).optional(),
  platform: z.union([z.literal("linux"), z.literal("windows")]).optional(),
  restart_policy: z.string().optional(),
  featured_image: z.string().optional(), //TODO: See about moving this to just v2 templates
  ports: z.union([dockyardV1TemplatePortsSchema, dockyardV2TemplatePortSchema]).optional(),
  volumes: z.array(dockyardTemplateVolumeSchema).optional(),
  env: z.array(dockyardTemplateEnvironmentSchema).optional(),
  labels: z.array(dockyardTemplateLabelsSchema).optional(),
  privileged: z.boolean().optional(),
  interactive: z.boolean().optional(),
  hostname: z.string().optional(),
  cap_add: z.array(capAddSchema).optional(),
  cap_drop: z.array(capDropSchema).optional(),
  sysctls: z.array(z.record(z.string(), z.string())).optional(),
  devices: z.array(devicesSchema).optional(),
  limits: z
    .object({
      cpus: z.number().optional(),
      mem_limit: z.number().optional()
    })
    .optional()
})

export type DockyardV1Template = z.infer<typeof dockyardV1TemplateSchema>

export const dockyardV2TemplateSchema = dockyardV1TemplateSchema.extend({
  featured_image: z.string().optional(),
  ports: dockyardV2TemplatePortSchema.optional()
});

export type DockyardV2Template = z.infer<typeof dockyardV2TemplateSchema>

export const portainerV1TemplateSchema = dockyardV1TemplateSchema.extend({
  type: z.number(),
  ports: z.array(z.string()).optional()
})

export type PortainerV1Template = z.infer<typeof portainerV1TemplateSchema>



export const portainerV2TemplateSchema = z.object({
  version: z.literal("2"),
  templates: z.array(portainerV1TemplateSchema)
})

export type PortainerV2Template = z.infer<typeof portainerV2TemplateSchema>

export const dockyardTemplateSchema = z.object({
  name: z.string(),
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
  type: z
    .union([
      z.literal("portainerv1"),
      z.literal("portainerv2"),
      z.literal("dockyardv1"),
      z.literal("dockyardv2")
    ])
    .optional(),
  authors: z.array(dockyardTemplateAuthorSchema).optional(),
  links: z.array(dockyardTemplateLinkSchema).optional(),
  featured: z.array(z.number()).optional(),
  templates: z.union([
    z.array(portainerV1TemplateSchema),
    portainerV2TemplateSchema.shape.templates,
    z.array(dockyardV1TemplateSchema),
    z.array(dockyardV2TemplateSchema)
  ])
})

export type DockyardTemplate = z.infer<typeof dockyardTemplateSchema>

// const test: DockyardTemplate['templates'][0]['ports'] = [
//   {
//     "WebUI": "32400:32400/tcp",
//     "DNLA": "1900:1900/udp",
//     "Companion": "3005:3005/tcp",
//     "Bonjour/Avahi": "5353:5353/udp",
//     "Roku Control": "8324:8324/tcp",
//     "GDM-1": "32410:32410/udp",
//     "GDM-2": "32412:32412/udp",
//     "GDM-3": "32413:32413/udp",
//     "GDM-4": "32414:32414/udp",
//     "DNLA TCP": "32469:32469/udp"
//   }
// ]