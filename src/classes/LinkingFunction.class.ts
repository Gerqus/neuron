import { WorkingLayers } from "./Network.class";

export interface LinkingFunctionSchema {
    (x: WorkingLayers): void;
}