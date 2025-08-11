import { Difficulty } from './difficulty.enum';

export interface UiProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description?: string | null;
}
