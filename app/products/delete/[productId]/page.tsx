'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProductType } from '@/app/types';

// component
import Layout from '@/app/components/Layout';

interface ProductParams {
  productId: string;
}

const DeleteProductPage = ({ params }: { params: ProductParams }) => {
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);

  const id = params.productId;

  useEffect(() => {
    axios.get(`/api/products?id=${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  const goBack = () => {
    return router.push('/products');
  };

  const deleteProduct = async () => {
    await axios.delete(`/api/products?id=${id}`).then(res => {
      goBack();
    })
  }

  return (
    <Layout>
      <h1 className='text-center'>Do you really want to delete&nbsp;&#34;{product?.title}&#34;?</h1>
      <div className='flex gap-2 justify-center'>
        <button className='btn-red' onClick={deleteProduct}>Yes</button>
        <button className='btn-default' onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  );
};

export default DeleteProductPage;