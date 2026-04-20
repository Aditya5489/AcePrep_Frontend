export const BASE_URL = "https://aceprep-backend-drnv.onrender.com";


export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",
  },

  SESSION: {
    CREATE: "/api/sessions/create",
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
  },

  RESUME: {
    ANALYZE: "/api/resume/analyze",
    GET_HISTORY: "/api/resume/history",
    GET_ONE: (id) => `/api/resume/${id}`,
    DELETE: (id) => `/api/resume/${id}`,
    DOWNLOAD_REPORT: (id) => `/api/resume/${id}/report`,
  },
};