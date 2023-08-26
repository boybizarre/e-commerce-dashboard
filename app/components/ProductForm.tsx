'use client';

import { useState, FormEvent, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';

import { ProductType } from '../types';

interface ProductFormProps {
  productInfo?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ productInfo }) => {
  const router = useRouter();

  const [title, setTitle] = useState(productInfo?.title || '');
  const [description, setDescription] = useState(
    productInfo?.description || ''
  );
  const [price, setPrice] = useState(productInfo?.price || '');
  const [goToProducts, setGoToProducts] = useState(false);

  const saveProduct = async (e: FormEvent<HTMLFormElement>) => {
    const id = productInfo?._id;

    e.preventDefault();

    const data = {
      title,
      description,
      price,
    };

    if (id) {
      // update
      await axios.put('/api/products', { ...data, id });
    } else {
      // create product
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  };

  useEffect(() => {
    if (goToProducts) {
      // return redirect('/products');
      router.push('/products'); // can also use useRouter
    }
  }, [goToProducts]);

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type='text'
        placeholder='Product Name'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Photos</label>
      <div className='mb-2'>
        {!productInfo?.images?.length && <p>No photos for this product</p>}
      </div>

      <label>Description</label>
      <textarea
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in USD)</label>
      <input
        type='number'
        placeholder='Price'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type='submit' className='btn-primary'>
        SAVE
      </button>
    </form>
  );
};

export default ProductForm;
