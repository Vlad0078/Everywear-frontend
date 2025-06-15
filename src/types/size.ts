export interface Size {
  _id: string;
  // code: string;
  size: string;
  categoryId?: string;
}

export interface SizeTable {
  _id: string;
  title_uk: string;
  title_en: string;
  sizes: {
    size?: string;
    sizeUA?: string;
    sizeEU?: string;
    sizeUK?: string;
    sizeIT?: string;
    sizeFR?: string;
    sizeDE?: string;
    sizeUS?: string;
    measurements: {
      age?: string;
      height?: string;
      chest?: string;
      waist?: string;
      hips?: string;
      footLength?: string;
    }[];
  };
}
