import { NextResponse } from 'next/server';
import { Category } from '@/models/Category';
import { mongooseConnect } from '@/app/lib/mongoose';

import { isAdminRequest } from '@/app/actions/isAdmin';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { name, parentCategory, properties } = body;

    if (!name) {
      return new NextResponse('Missing Category Name', { status: 400 });
    }

    await mongooseConnect();
    await isAdminRequest();

    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });

    return NextResponse.json(categoryDoc);
  } catch (error: any) {
    console.log(error, 'CATEGORY_CREATION_ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request, res: Response) {
  
  try {
    await mongooseConnect();
    await isAdminRequest();
    const allCategories = await Category.find().populate('parent');
    return NextResponse.json(allCategories);
  } catch (error: any) {
    console.log(error, 'SERVER ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request, res: Response) {
  
  try {
    await mongooseConnect();
    await isAdminRequest();
    const body = await req.json();
    const { name, parentCategory, properties, id } = body;
    await Category.updateOne(
      { _id: id },
      { name, parent: parentCategory || undefined, properties }
    );

    return NextResponse.json(true);
  } catch (error: any) {
    console.log(error, 'UPDATE ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request, res: Response) {
  
  try {
    await isAdminRequest();
    await mongooseConnect();
    // getting the query parameter from the url
    const id = new URL(req.url).searchParams.get('id');

    if (id) {
      await Category.deleteOne({ _id: id });
      return NextResponse.json('OK');
    }
  } catch (error: any) {
    console.log(error, 'UPDATE ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
