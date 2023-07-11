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
  toggleEdit: (pathId) => {
    const pathList = get().pathList.map((path) => {
      if (path._id === pathId) {
        return { ...path, isEdit: !path.isEdit };
      }
      return path;
    });
    console.log(get().pathList);
    set({ pathList });
  },
  setContextMenuData: (data) => {
    set({ contextMenuData: data });
  },
}));

export default usePathCardStore;
