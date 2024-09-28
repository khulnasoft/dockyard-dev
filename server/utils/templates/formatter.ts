import { dockyardV1TemplateSchema, dockyardV2TemplateSchema, portainerV1TemplateSchema, portainerV2TemplateSchema, type PortainerV1Template, type DockyardV1Template, type DockyardV2Template, type PortainerV2Template, type DockyardTemplate, dockyardTemplateSchema } from "~/types/templates/dockyard";

interface TemplateInfo {
    name: string;
    title: string;
    url: string;
    type: 'dockyardv1' | 'dockyardv2' | 'portainerv1' | 'portainerv2';
}

export const getTemplateType = (template: PortainerV1Template[] | DockyardV1Template[] | DockyardTemplate | PortainerV2Template): 'dockyardv1' | 'dockyardv2' | 'portainerv1' | 'portainerv2' => {
    if (dockyardV2TemplateSchema.safeParse(template).success) {
        return 'dockyardv2';
    } else if (dockyardV1TemplateSchema.safeParse(template).success) {
        return 'dockyardv1';
    } else if (portainerV1TemplateSchema.safeParse(template).success) {
        return 'portainerv1';
    } else if (portainerV2TemplateSchema.safeParse(template).success) {
        return 'portainerv2';
    } else {
        throw createError('Unknown template type.');
    }
}


export const typeTemplate = async (template: PortainerV1Template[] | DockyardV1Template[] | DockyardTemplate | PortainerV2Template, { name, title, type, url }: TemplateInfo): Promise<DockyardTemplate> => {
    const formattedTemplate: DockyardTemplate | null = await formatTemplate({ name, title, url, type }, template);
    if (!formattedTemplate === null) {
        throw createError('Unknown template type.');
    }
    return formattedTemplate as DockyardTemplate;
}

const formatTemplate = async (info: { name: string, title: string, url: string, type: 'dockyardv1' | 'dockyardv2' | 'portainerv1' | 'portainerv2' }, template: any): Promise<DockyardTemplate | null> => {
    const now = new Date().toISOString();
    switch (info.type) {
        case 'dockyardv1':
            return {
                ...info,
                created: now,
                image: undefined,
                authors: undefined,
                featured: undefined,
                description: undefined,
                links: undefined,
                templates: template
            };
        case 'dockyardv2':
            return {
                ...template,
                name: info.name,
                title: info.title,
                created: now,
                updated: now,
                url: info.url,
                type: info.type
            };
        case 'portainerv1':
            return {
                ...info,
                created: now,
                updated: now,
                templates: template as PortainerV1Template[]
            };
        case 'portainerv2':
            return {
                ...info,
                created: now,
                updated: now,
                templates: template.templates
            };
        default:
            return null;
    }
}