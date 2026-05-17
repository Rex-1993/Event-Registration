let dialogInstance = null;

export const setDialogInstance = (instance) => {
  dialogInstance = instance;
};

export const dialog = {
  alert: (message, title = "提示") => {
    if (!dialogInstance) {
      window.alert(message);
      return Promise.resolve();
    }
    return dialogInstance.alert(message, title);
  },
  confirm: (message, title = "確認動作") => {
    if (!dialogInstance) {
      return Promise.resolve(window.confirm(message));
    }
    return dialogInstance.confirm(message, title);
  },
  prompt: (message, defaultValue = "", title = "輸入資料") => {
    if (!dialogInstance) {
      return Promise.resolve(window.prompt(message, defaultValue));
    }
    return dialogInstance.prompt(message, defaultValue, title);
  }
};
