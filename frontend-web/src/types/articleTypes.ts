// ZÍSKAVANIE LISTU ČLÁNKOV
// GET api/Article

// Definícia pre parametre volania API pre získanie listu čLákov
export interface ArticlesApiParams {
  page: number;
  pageSize: number;
}

// Definícia pre očakávanú odpoveď API pre získanie listu článkov
export interface ArticlesApiResponse {
  page: number;
  pageSize: number;
  count: number;
  data: ArticleApiResponse[];
}

//--------------------------------------------------------------------------------
// ZÍSKAVANIE ČLÁNKU POMOCOU JEHO ID
// GET /api/Article/{id}

// Definícia pre parametre volania API pre získanie článku pomocou jeho ID
// export interface ArticleApiParams {
//   articleId: string;
// }

// Definícia pre očakávanú odpoveď API pre získanie článku pomocou jeho ID
export interface ArticleApiResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  title: string;
  teaser: string;
  content: string;
}

// Definícia props pre volanie funkcie(komponentu) ArticleCards
// -------------------------------------------------------------------
export interface ArticleCardsProps {
  params: ArticlesApiParams;
  pagination: boolean;
}
