import { ObjectId } from "mongodb";

export interface Category {
	_id: ObjectId;
	name: string;
	color: string;
}

export type CreateCategoryInput = Pick<Category, "name" | "color">;
