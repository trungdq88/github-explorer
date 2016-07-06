export const ROUTES = {
  HOME: '/',
  USER_DETAIL: '/user/:username',
  USER_REPO_LIST: '/user/:username/repos',
  REPO_DETAIL: '/user/:username/repos/:repoName',
};

export const matchParams = (route, params) => {
  const keys = Object.keys(params);
  let path = route;
  keys.forEach(key => {
    path = path.replace(`:${key}`, params[key]);
  });
  return path;
};
