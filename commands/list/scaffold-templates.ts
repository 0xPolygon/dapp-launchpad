import { getAvailableScaffoldTemplates } from "../../utils/config";
import { logInfoWithBg } from "../../utils/print"

/**
 * @description Lists available scaffold templates
 */
export const listScaffoldTemplates = () => {
    logInfoWithBg(`Available templates: ${getAvailableScaffoldTemplates().join(", ")}`);
}
