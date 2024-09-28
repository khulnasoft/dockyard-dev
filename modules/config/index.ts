import { defineNuxtModule, addImportsDir, createResolver, addRouteMiddleware, addServerPlugin, installModule, addImports } from '@nuxt/kit'
import { defu } from 'defu'
import { join } from 'path'
import logging from '../logging'
import core from '../notifications'

const defaultConfigOptions: ConfigOptions =
{
    configPath: process.env.NODE_ENV === 'production' ? '../config' : './config',
    dataPath: process.env.NODE_ENV === 'production' ? '../data' : './data'
}

export default defineNuxtModule({
    meta: { name: 'config' },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)
        await installModule(logging, null, nuxt)
        await installModule(core, null, nuxt)

        console.log(nuxt.options.rootDir)


        // Get paths from environment variables or use our default options
        const configOptions = defu({
            configPath: process.env.CONFIG_PATH,
            dataPath: process.env.DATA_PATH
        }, {
            configPath: join(nuxt.options.rootDir, defaultConfigOptions.configPath),
            dataPath: join(nuxt.options.rootDir, defaultConfigOptions.dataPath)
        })

        // Add config options to runtime config
        nuxt.options.dockyard ||= {
            configOptions
        }

        nuxt.options.runtimeConfig.dockyard ||= {
            configOptions
        }

        addImports([
            {
                name: 'useConfig',
                from: resolver.resolve('runtime/server/utils/config.ts'),
            },
            {
                name: 'DockyardConfig',
                from: resolver.resolve('types/index.ts'),
                type: true
            },
            {
                name: 'ServerSettings',
                from: resolver.resolve('types/server.ts'),
                type: true
            },
        ])

        addRouteMiddleware({
            name: 'config',
            path: resolver.resolve('runtime/middleware/config.ts'),
            global: true
        })
        addImportsDir(resolver.resolve('runtime/server/utils'))
        addImportsDir(resolver.resolve('types'))
        addServerPlugin(resolver.resolve('plugin/01-server-config.ts'))
    }
})

interface ConfigOptions {
    configPath: string,
    dataPath: string
}

declare module '@nuxt/schema' {
    interface NuxtOptions {
        dockyard: {
            configOptions: ConfigOptions
        }
    }
    interface RuntimeConfig {
        dockyard: {
            configOptions: ConfigOptions
        }
    }
}