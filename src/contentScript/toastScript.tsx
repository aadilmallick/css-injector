import { ToastManager } from "../utils/Toast";

const toast = new ToastManager({
  position: "bottom-left",
  id: "amallick-toast",
});
toast.setup();
toast.success("CSS applied successfully");
