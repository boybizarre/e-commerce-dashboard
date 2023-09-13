// import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import { mongooseConnect } from '@/app/lib/mongoose';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { title, description, price, images } = body;

    if (!title || !description || !price) {
      return new NextResponse('Missing Info', { status: 400 });
    }

    await mongooseConnect();

    const product = await Product.create({
      title,
      description,
      price,
      images,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.log(error, 'PRODUCT_REGISTRATION ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request, res: Response) {
  await mongooseConnect();

  try {
    // getting the query parameter from the url
    const id = new URL(req.url).searchParams.get('id');

    // checking if it's a query string; then get single product matching query id
    if (id) {
      const singleProduct = await Product.findOne({ _id: id });
      return NextResponse.json(singleProduct);
    } else {
      // else get all products
      const products = await Product.find();
      return NextResponse.json(products);
    }
  } catch (error: any) {
    console.log(error, 'SERVER ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request, res: Response) {
  await mongooseConnect();

  try {
    const body = await req.json();
    console.log(body);
    const { title, description, price, images, id } = body;
    await Product.updateOne({ _id: id }, { title, description, price, images });

    return NextResponse.json(true);
  } catch (error: any) {
    console.log(error, 'UPDATE ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, res: Response) {
  await mongooseConnect();

  try {
    // getting the query parameter from the url
    const id = new URL(req.url).searchParams.get('id');

    if (id) {
      await Product.deleteOne({ _id: id });
      return NextResponse.json(true);
    }
  } catch (error: any) {
    console.log(error, 'UPDATE ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// const { method } = req;

// if (method === 'GET') {
//   const products = await Product.find();
//   return NextResponse.json(products);
// }

// if (method === 'POST') {

// import clientPromise from '../lib/mongodb';

// const handle = async (req: any, res: any) => {
//   const { method } = req;
//   console.log(req)
//   if (method === 'POST') {
//     await mongooseConnect();
//     const { title, description, price } = req.body;
//     const productDoc = await Product.create({
//       title, description, price
//     })
//     res.json(productDoc);
//     // res.json('post')
//   }
// };

// export default handle;
