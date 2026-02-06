export const MVP_SOURCE = "MVP";
export const INITIAL_MVP_VALUE = "!roll pour devenir MVP";

// TODO: list scenes with ids instead
// Scene names
export const STARTING_SCENE_NAME = "Lancement";
export const BREAK_SCENE_NAME = "Break";
export const ENDING_SCENE_NAME = "Fin";
export const CELESTE_NO_CAM_SCENE_NAME = "Celeste No Cam";

export const noCamScenes: Array<string> = [
  STARTING_SCENE_NAME,
  BREAK_SCENE_NAME,
  ENDING_SCENE_NAME,
  CELESTE_NO_CAM_SCENE_NAME,
];

export const TIKTOK_SCENE_NAME = "Tiktok verticale";

// API calls
export const UPDATE_TEXT_SOURCE_CALL = "SetInputSettings";
export const UPDATE_SOURCE_FILTER_CALL = "SetSourceFilterEnabled";
export const GET_SCENE_CALL = "GetCurrentProgramScene";
export const SET_SCENE_CALL = "SetCurrentProgramScene";
