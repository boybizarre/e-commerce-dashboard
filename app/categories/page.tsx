'use client';

import { useState, useEffect, FormEvent } from 'react';
import Layout from '../components/Layout';

import axios from 'axios';
import Swal from 'sweetalert2';

import { CategoryType } from '../types';

const Categories = () => {
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState<string | undefined>('');

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const fetchCategories = () => {
    axios.get('/api/categories').then((res) => setCategories(res.data));
  };

  const saveCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      name,
      parentCategory,
    };

    if (editedCategory) {
      
      axios.put('/api/categories', { ...data, id: editedCategory._id });
      setEditedCategory(null);

    } else {
      axios.post('/api/categories', data);
    }

    setName('');
    setParentCategory('');
    fetchCategories();
  };

  const editCategory = (category: CategoryType) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
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
      console.log(result);
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete(`/api/categories?id=${_id}`)
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        fetchCategories();
      }
    });
  }

  // RETURNING JSX from here
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit ${editedCategory.name} category`
          : 'Create new category'}
      </label>
      <form className='flex gap-1' onSubmit={saveCategory}>
        <input
          className='mb-0'
          type='text'
          placeholder='Category Name'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <select
          className='mb-0'
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value='0'>No Parent Category</option>
          {categories.length > 0 &&
            categories.map((category: CategoryType) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        <button className='btn btn-primary'>SAVE</button>
      </form>

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
                    className='btn-primary mr-1'
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteCategory(category)} className='btn-primary'>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Categories;