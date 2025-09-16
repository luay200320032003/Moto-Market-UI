export const createPageUrl = (pageName: string): string => {
  if (pageName.toLowerCase() === "home") {
    return "/";
  }
  return `/${pageName}`;
};

