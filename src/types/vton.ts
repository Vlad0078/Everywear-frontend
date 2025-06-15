export interface Vton {
  _id: string;
  userId: string;
  productId: string;
  personImageUrl: string;
  clothingImageUrl: string;
  generatedImageUrl: string;
  status: VtonStatus;
  createdAt: Date;
}

export enum VtonStatus {
  processing = "processing",
  complete = "complete",
  error = "error",
}
