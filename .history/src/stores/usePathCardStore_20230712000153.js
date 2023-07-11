import axios from "axios";
import { create } from "zustand";

const userId = "wkdrmadl3";
const usePathCardStore = create((set, get) => ({
  pathList: [],
  contextMenuData: null,
  getPathList: async () => {
    const response = await axios.get("/api/path/getList", {
      params: { userId },
    });
    set({ pathList: response.data });
  },
  create: async () => {
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
  delete: async (pathId) => {
    if (pathId === null) return;

    const deletePath = await axios.delete("/api/path/delete", {
      params: { pathId },
    });

    if (deletePath.status === 200) {
      await get().getPathList();
      set({ contextMenuData: null });
    }
  },
  edit: async (pathId) => {
    if (pathId === null) return;

    const pathName = prompt("path의 이름을 입력하세요", "Path명");

    if (pathName === null) return;

    const editPath = await axios.put("/api/path/edit", {
      pathId,
      title: pathName,
    });

    if (editPath.status === 200) {
      await get().getPathList();
      set({ contextMenuData: null });
    }
  },
  setContextMenuData: (data) => {
    set({ contextMenuData: data });
  },
}));

export default usePathCardStore;
