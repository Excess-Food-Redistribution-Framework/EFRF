// GET api/Article
export interface ListOfArticles {
  page: number;
  pageSize: number;
  count: number;
  data: Article[];
}

// GET /api/Article/{id}
export interface Article {
  createdAt: string;
  updatedAt: string;
  id: string;
  title: string;
  teaser: string;
  content: string;
}

export type ArticleByIdProps = {
  articleId: string;
};

// Pre parametre komponentu articlesCards
export type ArticleCardsProps = {
  page: number;
  pageSize: number;
};
