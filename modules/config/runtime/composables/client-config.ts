import type { DockyardConfig } from "../../types"

export const useClientConfig = () => {
    const clientConfig = useState<Pick<DockyardConfig, 'auth' | 'theme' | 'name'> | null>("auth-enabled", () => null)
    return clientConfig
}