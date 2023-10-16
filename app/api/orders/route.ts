import { NextResponse } from 'next/server';
import { Order } from '@/models/Order';
import { mongooseConnect } from '@/app/lib/mongoose';

export async function GET(req: Request, res: Response) {
  try {
    await mongooseConnect();

    return NextResponse.json(await Order.find().sort({ createdAt: -1 }));
  } catch (error: any) {
    console.log(error, 'GET ORDERS ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
