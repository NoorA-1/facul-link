import skills from "./skills.txt?raw";
export const skillsList = skills.split("\n");

import programNames from "./program_names.txt?raw";
export const programNamesList = programNames.split("\n");

export const serverURL = import.meta.env.VITE_BACKENDURL;
