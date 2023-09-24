'use client';

import { useState, useEffect, FormEvent } from 'react';
import Layout from '../components/Layout';

import axios from 'axios';
import Swal from 'sweetalert2';

import { CategoryType, PropertyType } from '../types';

const Categories = () => {
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [parentCategory, setParentCategory] = useState<string | undefined>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('/api/categories').then((res) => setCategories(res.data));
  };

  const saveCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        values: property.values.split(','),
      })),
    };

    if (editedCategory) {
      axios.put('/api/categories', { ...data, id: editedCategory._id });
      setEditedCategory(null);
    } else {
      axios.post('/api/categories', data);
    }

    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  };

  const editCategory = (category: CategoryType) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
    setProperties(
      category.properties.map(({ name, values }: any) => ({
        name,
        values: values.join(','),
      }))
    );
  };

  const deleteCategory = (category: CategoryType) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#666',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete(`/api/categories?id=${_id}`);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        fetchCategories();
      }
    });
  };

  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }];
    });
  };

  const handlePropertyNameChange = (
    index: number,
    property: PropertyType,
    newName: string
  ) => {
    // console.log(index, property, value);
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValuesChange = (
    index: number,
    property: PropertyType,
    newValues: string
  ) => {
    // console.log(index, property, value);
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove: number) => {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  };

  // RETURNING JSX from here
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit ${editedCategory.name} category`
          : 'Create new category'}
      </label>

      <form onSubmit={saveCategory}>
        <div className='flex gap-1'>
          <input
            type='text'
            placeholder='Category Name'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value='0'>No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category: CategoryType, index) => (
                <option key={index} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className='mb-2'>
          <label className='block'>Properties</label>
          <button
            className='btn-default text-sm mb-2'
            type='button'
            onClick={addProperty}
          >
            Add New Property
          </button>

          {properties.length > 0 &&
            properties.map((property: PropertyType, index) => (
              <div key={index} className='flex gap-1 m-2'>
                <input
                  className='mb-0'
                  value={property.name}
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                  type='text'
                  placeholder='property name (example: color)'
                />
                <input
                  className='mb-0'
                  type='text'
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                  placeholder='values, comma separated'
                />
                <button
                  type='button'
                  className='btn-red'
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className='flex gap-1'>
          {editedCategory && (
            <button
              className='btn-default'
              type='button'
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button className='btn btn-primary py-1'>SAVE</button>
        </div>
      </form>

      {/* TABLE */}
      {!editedCategory && (
        <table className='basic mt-4'>
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category: CategoryType) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className='btn-default mr-1'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className='btn-red'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default Categories;
