import axios from "axios";
import { create } from "zustand";

const userId = "wkdrmadl3";
const usePathCardStore = create((set, get) => ({
  pathList: get().getPathList(),
  getPathList: async () => {
    const response = await axios.get("/api/path/getList", {
      params: { userId },
    });
    set({ pathList: response.data });
  },
  createPath: async () => {
    const pathName = prompt("path의 이름을 입력하세요", "Path명");

    if (pathName === null) return;

    const createPath = await axios.post("/api/path/create", {
      userId,
      title: pathName,
    });

    if (createPath.status === 200) {
      await get().getPathList();
      return createPath.data.id;
    }
  },
}));
export default usePathCardStore;