import axios from "axios";
import { create } from "lodash";

const usePathCardStroe = create((set, get) => ({
  pathList: [],
  setPathList: (pathList) => set({ pathList }),
  getPathList: async (userId) => {
    const response = await axios.get("/api/path/getList", {
      params: { userId },
    });
    set({ pathList: response.data });
  },
}));
export default usePathCardStroe;
