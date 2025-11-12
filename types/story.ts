// import { User } from "./user";

export type Story = {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  ownerId: Author;
  date: string;
  favoriteCount: number;
  isFavorite?: boolean;
};

export interface Category {
  _id: string;
  name: string;
}

export interface Author {
  _id: string;
  name: string;
  avatarUrl: string;
  articlesAmount?: number;
  description?: string;
}

export interface StoriesResponse {
  status: number;
  message: string;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: Story[];
}

// export interface FetchStoriesParams {
//     page?: number;
//     perPage?: number;
// }

// export interface FetchStoriesResponse {
//     page: number;
//     data: Story[];
//     total_pages: number;
//     perPage: number;
// }

// export interface RawFetchStoriesResponse {
//   stories: Story[];
//   totalPages: number;
// }
