export interface HelloWorldResponse {
  message: string;
}

// GET api/Article
export interface ArticleResponse {
  page: number;
  pageSize: number;
  count: number;
  data: ArticleIdResponse[];
}

// GET /api/Article/{id}
export interface ArticleIdResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  title: string;
  content: string;
}
