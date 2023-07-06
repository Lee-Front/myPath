import axios from "axios";
import { create } from "zustand";

const usePathCardStore = create((set, get) => ({
  pathList: [],
  //setPathList: (pathList) => set({ pathList }),
  getPathList: async () => {
    const userId = "wkdrmadl3";
    const response = await axios.get("/api/path/getList", {
      params: { userId },
    });
    set({ pathList: response.data });
    //1
  },
}));
export default usePathCardStore;