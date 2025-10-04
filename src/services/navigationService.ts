// navigationService.ts
let navigateFunction: (path: string) => void;

export const setNavigator = (navigate: (path: string) => void) => {
  navigateFunction = navigate;
};

export const navigate = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.error("Navigate function not set!");
  }
};
