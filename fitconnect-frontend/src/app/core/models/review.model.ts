export type ReviewTargetType = 'COACH' | 'NUTRITIONNISTE' | 'PRODUIT';

export interface ReviewRequest {
  targetType: ReviewTargetType;
  targetId: number;
  note: number;
  commentaire?: string;
}

export interface Review {
  id: number;
  author: any;
  targetType: ReviewTargetType;
  targetId: number;
  note: number;
  commentaire?: string;
  createdAt: string;
}
