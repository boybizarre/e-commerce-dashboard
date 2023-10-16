'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// components
import Layout from '../components/Layout';
import { OrderType } from '../types';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders').then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div>
      <Layout>
        <h1>Orders</h1>
        <table className='basic'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paid</th>
              <th>Recipient</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order: OrderType, index) => (
                <tr key={index}>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td
                    className={order.paid ? 'text-green-600' : 'text-red-600'}
                  >
                    {order.paid ? 'YES' : 'NO'}
                  </td>
                  <td>
                    {order.name} {order.email} <br /> {order.city}{' '}
                    {order.postalCode} {order.country} <br />{' '}
                    {order.streetAddress}
                  </td>
                  <td>
                    {order.line_items.map((lineItem, index) => (
                      <div key={index}>
                        {lineItem.price_data?.product_data.name} x{' '}
                        {lineItem.quantity} <br />
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default Orders;
