export type ProductType = {
  _id: string,
  title: string,
  description: string,
  price: number,
  __v?: number,
  images?: string[],
}

export type CategoryType = {
  _id: string;
  name: string;
  parent?: {
    name: string;
    _id: string;
  };
};