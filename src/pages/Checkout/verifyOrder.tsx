import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

import { Link, useSearchParams } from "react-router";
import { useVerifyOrderQuery } from "@/redux/features/order/order";

interface OrderData {
  id: number;
  order_id: string;
  currency: string;
  amount: number;
  payable_amount: number;
  discsount_amount: number | null;
  disc_percent: number;
  received_amount: string;
  usd_amt: number;
  usd_rate: number;
  is_verify: number;
  card_holder_name: string | null;
  card_number: string | null;
  phone_no: string;
  bank_trx_id: string;
  invoice_no: string;
  bank_status: string;
  customer_order_id: string;
  sp_code: string;
  sp_message: string;
  name: string;
  email: string;
  address: string;
  city: string;
  value1: string | null;
  value2: string | null;
  value3: string | null;
  value4: string | null;
  transaction_status: string | null;
  method: string;
  date_time: string;
  tracking_number?: string;
  estimatedDeliveryDate?: string;
}

export default function OrderVerification() {
  const [searchParams] = useSearchParams();

  const { isLoading, data } = useVerifyOrderQuery(
    searchParams.get("order_id"),
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Access order data while handling different response formats
  const orderData: OrderData = data?.data?.[0];
  
  // Function to find estimated delivery date in nested objects
  const findEstimatedDeliveryDate = (obj: unknown): string | undefined => {
    // If not an object or null, return undefined
    if (!obj || typeof obj !== 'object') return undefined;
    
    // Use type assertion after checking it's an object
    const dataObj = obj as Record<string, unknown>;
    
    // Direct check for estimatedDeliveryDate property
    if ('estimatedDeliveryDate' in dataObj && typeof dataObj.estimatedDeliveryDate === 'string') {
      return dataObj.estimatedDeliveryDate;
    }
    
    // Check for nested order property
    if ('order' in dataObj && dataObj.order && typeof dataObj.order === 'object') {
      const order = dataObj.order as Record<string, unknown>;
      if ('estimatedDeliveryDate' in order && typeof order.estimatedDeliveryDate === 'string') {
        return order.estimatedDeliveryDate;
      }
    }
    
    // Also check in data property
    if ('data' in dataObj && dataObj.data && typeof dataObj.data === 'object') {
      const nestedData = dataObj.data as Record<string, unknown>;
      
      // Check directly in data
      if ('estimatedDeliveryDate' in nestedData && typeof nestedData.estimatedDeliveryDate === 'string') {
        return nestedData.estimatedDeliveryDate;
      }
      
      // Check in data.order
      if ('order' in nestedData && nestedData.order && typeof nestedData.order === 'object') {
        const nestedOrder = nestedData.order as Record<string, unknown>;
        if ('estimatedDeliveryDate' in nestedOrder && typeof nestedOrder.estimatedDeliveryDate === 'string') {
          return nestedOrder.estimatedDeliveryDate;
        }
      }
    }
    
    return undefined;
  };
  
  // Try to find estimated delivery date in the response
  const estimatedDeliveryDate = findEstimatedDeliveryDate(data);
  
  // Create a fallback delivery date (7 days from now) if none is provided
  const fallbackDeliveryDate = new Date();
  fallbackDeliveryDate.setDate(fallbackDeliveryDate.getDate() + 7);
  
  // Generate a tracking number if it doesn't exist
  const trackingNumber = 
    orderData?.tracking_number || 
    data?.data?.order?.trackingNumber ||
    (orderData?.order_id ? `TRK-${orderData.order_id.substring(0, 8)}` : 'Not available');
  
  // Format the estimated delivery date
  const formatEstimatedDelivery = (dateString?: string) => {
    if (!dateString) {
      // Return the fallback date if no date is provided
      return fallbackDeliveryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      // Return the fallback date if there's an error
      return fallbackDeliveryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // For debugging
  console.log("API Response:", data);
  console.log("Found estimated delivery date:", estimatedDeliveryDate);

  return isLoading ? (
    <div className="container mx-auto p-4">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Order Verification</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Order ID:</dt>
              <dd>{orderData?.order_id}</dd>
              <dt className="font-semibold">Amount:</dt>
              <dd>
                {orderData?.currency} {orderData?.amount?.toFixed(2)}
              </dd>
              <dt className="font-semibold">Status:</dt>
              <dd>
                <Badge
                  variant={
                    orderData?.bank_status === "Success"
                      ? "default"
                      : "destructive"
                  }
                >
                  {orderData?.bank_status}
                </Badge>
              </dd>
              <dt className="font-semibold">Date:</dt>
              <dd>{new Date(orderData?.date_time)?.toLocaleString()}</dd>
              <dt className="font-semibold text-red-600">Estimated Delivery:</dt>
              <dd className="text-red-600">{formatEstimatedDelivery(estimatedDeliveryDate)}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Method:</dt>
              <dd>{orderData?.method}</dd>
              <dt className="font-semibold">Transaction ID:</dt>
              <dd>{orderData?.bank_trx_id}</dd>
              <dt className="font-semibold">Invoice No:</dt>
              <dd>{orderData?.invoice_no}</dd>
              <dt className="font-semibold">SP Code:</dt>
              <dd>{orderData?.sp_code}</dd>
              <dt className="font-semibold">SP Message:</dt>
              <dd>{orderData?.sp_message}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="font-semibold">Name:</dt>
              <dd>{orderData?.name}</dd>
              <dt className="font-semibold">Email:</dt>
              <dd>{orderData?.email}</dd>
              <dt className="font-semibold">Phone:</dt>
              <dd>{orderData?.phone_no}</dd>
              <dt className="font-semibold">Address:</dt>
              <dd>{orderData?.address}</dd>
              <dt className="font-semibold">City:</dt>
              <dd>{orderData?.city}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2 mb-4">
              <dt className="font-semibold">Tracking Number:</dt>
              <dd>{trackingNumber}</dd>
              <dt className="font-semibold">Estimated Delivery:</dt>
              <dd className="text-velo-red">{formatEstimatedDelivery(estimatedDeliveryDate)}  (7days latter from Current date)</dd>
            </dl>
            <div className="flex items-center gap-2">
              {orderData?.bank_status === "Success" ? (
                <>
                  <CheckCircle className="text-green-500" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="text-yellow-500" />
                  <span>Not Verified</span>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/dashboard/my-orders">
              <Button className="w-full">Track Order</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}