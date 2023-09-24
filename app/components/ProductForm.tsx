/* eslint-disable @next/next/no-img-element */
'use client';

// Uploadthing styles and component
import '@uploadthing/react/styles.css';
import { UploadDropzone } from '../utils/uploadthing';

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { redirect, useRouter } from 'next/navigation';
import axios from 'axios';
import { ReactSortable } from 'react-sortablejs';
// import { find } from 'lodash';

import {
  ProductType,
  CategoryType,
  newCategoryType,
  newPropertyType,
} from '../types';

import Spinner from './Spinner';

interface ProductFormProps {
  productInfo?: ProductType | null;
}

type ItemType = any[];

const ProductForm: React.FC<ProductFormProps> = ({ productInfo }) => {
  const router = useRouter();

  const [title, setTitle] = useState(productInfo?.title || '');

  const [description, setDescription] = useState(
    productInfo?.description || ''
  );

  const [price, setPrice] = useState(productInfo?.price || '');

  const [productProperties, setProductProperties] = useState(
    productInfo?.properties || {}
  );

  console.log(productInfo?.properties);

  const [images, setImages] = useState<ItemType>(productInfo?.images || []);

  const [category, setCategory] = useState<string | undefined>(
    productInfo?.category || ''
  );

  const [goToProducts, setGoToProducts] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState<newCategoryType[]>([] || null);

  const saveProduct = async (e: FormEvent<HTMLFormElement>) => {
    const id = productInfo?._id;

    e.preventDefault();

    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
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
      router.push('/products'); // can also use useRouter
    }

    axios.get('/api/categories').then((res) => {
      setCategories(res.data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goToProducts]);

  function updateImagesOrder(images: string[]) {
    setImages(images);
  }

  const propertiesToFill: newPropertyType[] = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    console.log({ catInfo });
    if (catInfo?.properties) {
      propertiesToFill.push(...catInfo?.properties);
      // console.log('propertiesToF', propertiesToFill);
      if (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        );
        if (parentCat?.properties) {
          propertiesToFill.push(...parentCat?.properties);

          // catInfo = parentCat;
        }
      }
    }
  }

  function setProductProp(propertyName: string, value: any) {
    setProductProperties((prev) => {
      const newProductProperties: Record<any, any> = { ...prev } as Record<
        any,
        any
      >;

      newProductProperties[propertyName as keyof typeof newProductProperties] =
        value;

      console.log(propertyName, value);
      console.log(newProductProperties);
      return newProductProperties;
    });
  }

  return (
    <>
      <form onSubmit={saveProduct}>
        <label>Product Name</label>
        <input
          type='text'
          placeholder='Product Name'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value=''>Uncategorized</option>
          {categories.length > 0 &&
            categories.map((category: newCategoryType) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p, index) => (
            <div key={index}>
              <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
              <div>
                <select
                  value={
                    productProperties[p.name as keyof typeof productProperties]
                  }
                  onChange={(e) => setProductProp(p.name, e.target.value)}
                >
                  {p.values.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

        <label>Photos</label>
        <div className='mb-2 flex flex-wrap gap-2'>
          <ReactSortable
            className='flex flex-wrap gap-1'
            list={images}
            setList={updateImagesOrder}
          >
            {!!images.length &&
              images.map((url) => (
                <div className='h-48 bg-white p-4 shadow-sm border border-gray-200' key={url}>
                  {/* <div>{url}</div> */}
                  <img className='rounded-lg' src={url} alt='product-image' />
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className='h-24 flex items-center'>
              <Spinner />
            </div>
          )}

          <UploadDropzone
            endpoint='imageUploader'
            onClientUploadComplete={(res) => {
              // Do something with the response
              // setIsUploading(true);
              if (res) {
                console.log('Files: ', res);
                setIsUploading(true);
                setImages((oldImages) => {
                  return [...oldImages, res[0].url];
                });
              }
              // alert('Upload Completed');
              setIsUploading(false);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
            className='bg-white shadow-md border border-gray-400 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 h-48 w-max cursor-pointer mt-0'
          />
        </div>
        {!productInfo?.images?.length && !images.length && (
          <p className='my-4'>No photos for this product</p>
        )}

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
    </>
  );
};

export default ProductForm;
