export function normalizeAuthUser(userInfo) {
  if (
    userInfo?.user &&
    typeof userInfo.user === "object" &&
    !Array.isArray(userInfo.user)
  ) {
    return userInfo.user;
  }
  return userInfo;
}

export function isCustomerSession({ token, userInfo }) {
  return Boolean(token && normalizeAuthUser(userInfo)?.role === "customer");
}

export function isRestoringAuthSession({ token, userInfo, status }) {
  return Boolean(
    token &&
      !normalizeAuthUser(userInfo) &&
      (status === "idle" || status === "loading"),
  );
}
