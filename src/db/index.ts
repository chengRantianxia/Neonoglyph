import Dexie from "dexie";
import type { Bookmark } from "@/types/bookmark";
import type { Category } from "@/types/category";

class BookmarkDatabase extends Dexie {
  bookmarks: Dexie.Table<Bookmark, string>;
  categories: Dexie.Table<Category, string>;

  constructor() {
    super("programmerBox_v2"); // 使用新的数据库名称

    this.version(1).stores({
      bookmarks:
        "++id, title, url, description, categoryId, order, createdAt, updatedAt, *tags",
      categories: "++id, name, order, createdAt, updatedAt",
    });

    this.bookmarks = this.table("bookmarks");
    this.categories = this.table("categories");
  }
}

const db = new BookmarkDatabase();
export default db;
