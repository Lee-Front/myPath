import axios from "axios";

import { create, useEffect } from "zustand";

const userId = "wkdrmadl3";
const usePathCardStore = create((set, get) => ({
  pathList: [],
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

useEffect(() => {
  get().getPathList();
});
export default usePathCardStore;
