export const saveToken = (token: string) => {
  localStorage.setItem("admin_token", token);
};

export const getToken = () => {
  return localStorage.getItem("admin_token");
};

export const clearToken = () => {
  localStorage.removeItem("admin_token");
};
