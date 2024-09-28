import type { DockyardConfig } from "../../../types";

export const defaultDockyardConfig: DockyardConfig = {
    name: 'Dockyard',
    servers: [{ name: 'local', options: { socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock' } }],
    auth: true,
    theme: {
        type: 'dark'
    },
    plugins: [],
    sessionTimeout: 60 * 60 * 24,
}