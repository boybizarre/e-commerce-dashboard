export type ProductType = {
  _id: string;
  title: string;
  description: string;
  price: number;
  __v?: number;
  images?: string[];
  category?: string;
  properties?: PropertyType;
};

export type CategoryType = {
  _id: string;
  name: string;
  parent?: {
    name: string;
    _id: string;
  };
  properties: PropertyType[];
};

export type PropertyType = {
  name: string;
  values: string;
};

// separate types for after splitting and converting the string properties values to an array
export type newCategoryType = {
  _id: string;
  name: string;
  parent?: {
    name: string;
    _id: string;
  };
  properties: newPropertyType[];
};

export type newPropertyType = {
  name: string;
  values: string[];
};
