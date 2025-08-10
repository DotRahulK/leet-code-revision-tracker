/* tslint:disable */
/* eslint-disable */
export interface UpsertProblemDto {

  /**
   * Problem description in Markdown
   */
  description?: string;

  /**
   * Problem difficulty
   */
  difficulty: 'Easy' | 'Medium' | 'Hard';

  /**
   * Unique problem slug
   */
  slug: string;

  /**
   * Associated tags
   */
  tags: Array<string>;

  /**
   * Problem title
   */
  title: string;
}
