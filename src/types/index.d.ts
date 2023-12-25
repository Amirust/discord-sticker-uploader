import { ProjectConfigImpl } from "@DSU/config/ProjectConfigImpl";
import DSU from "@DSU/core";

declare global {
    let config: ProjectConfigImpl;
    let dsu: DSU;
}