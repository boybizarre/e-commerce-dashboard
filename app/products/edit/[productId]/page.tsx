'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProductType } from "@/app/types";

// components
import Layout from '@/app/components/Layout';
import ProductForm from '../../../components/ProductForm';

interface ProductParams {
  productId: string;
}

const EditProductPage = ({ params }: { params: ProductParams }) => {
  const [productInfo, setProductInfo] = useState<ProductType | null>(null);

  useEffect(() => {
    axios.get(`/api/products?id=${params.productId}`).then((res) => {
      setProductInfo(res.data);
    });

    // console.log('productInfo', productInfo);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm productInfo={productInfo} />}
    </Layout>
  );
};

export default EditProductPage;
