import { type DockyardTemplate } from "~/types/templates/dockyard"
import { type CreateContainerForm } from "~/types/containers/create"
import { dockyardV1TemplatePortSchema, dockyardV2TemplatePortSchema } from "~/types/templates/dockyard"
import { type DockyardV2TemplatePort, type dockyardV1TemplatePorts } from "~/types/templates/dockyard"


export const useFormatPorts = async (ports: DockyardTemplate['templates'][0]['ports']): Promise<CreateContainerForm['ports']> => {
  let type: 'dockyardv2' | 'dockyardv1' | undefined
  const portlist: CreateContainerForm['ports'] = []
  !Array.isArray(ports) && dockyardV2TemplatePortSchema.safeParse(ports)
    ? type = 'dockyardv2'
    : dockyardV1TemplatePortSchema.safeParse(ports)
      ? type = 'dockyardv1'
      : type = undefined
  switch (type) {
    case 'dockyardv2': {
      Object.entries(ports as DockyardV2TemplatePort).map(([name, port]) => {
        portlist.push({
          host: port.host ? parseInt(port.host) : undefined,
          container: port.container ? parseInt(port.container) : undefined,
          protocol: port.protocol,
          label: name,
          unchangable: port.unchangable
        })
      })
      break;
    }
    case 'dockyardv1': {
      (ports as dockyardV1TemplatePorts).map((port): void => {
        if (typeof port === 'string') {
          port.includes(':') && port.includes('/')
            ? portlist.push({ host: parseInt(port.split(':')[0]), container: parseInt(port.split(':')[1].split('/')[0]), protocol: port.split('/')[1] as "tcp" | "udp" || undefined })
            : typeof port === 'string' && port.includes(':')
              ? portlist.push({ host: parseInt(port.split(':')[0]), container: parseInt(port.split(':')[1]) })
              : portlist.push({ container: parseInt(port) })
        } else {
          for (const _port in port) {
            const portString = port[_port]
            portString.includes(':') && portString.includes('/')
              ? portlist.push({ label: _port, host: parseInt(portString.split(':')[0]), container: parseInt(portString.split(':')[1].split('/')[0]), protocol: portString.split('/')[1] as "tcp" | "udp" || undefined })
              : portString.includes(':')
                ? portlist.push({ label: _port, host: parseInt(portString.split(':')[0]), container: parseInt(portString.split(':')[1]) })
                : portlist.push({ label: _port, container: parseInt(portString) })
          }
        }
      })
      break;
    }
  }
  return portlist
}