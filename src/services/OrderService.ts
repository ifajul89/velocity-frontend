// Order types
export interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface TimelineEvent {
  date: string;
  time: string;
  status: string;
  completed: boolean;
}

export interface Order {
  id: string;
  status: string;
  statusColor: string;
  date: string;
  estimatedDelivery: string;
  items: OrderItem[];
  total: string;
  trackingNumber: string;
  carrier: string;
  currentLocation: string;
  timeline: TimelineEvent[];
  shippingAddress: string;
  contactInfo: ContactInfo;
  message?: string;
}

// Initial orders data
const orders: Order[] = [
  {
    id: "ORD-12345",
    status: "In Transit",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    date: "May 15, 2023",
    estimatedDelivery: "May 18, 2023",
    items: [
      { name: "Product A", quantity: 2, price: "$49.99" },
      { name: "Product B", quantity: 1, price: "$29.99" },
    ],
    total: "$129.97",
    trackingNumber: "TRK987654321",
    carrier: "FedEx",
    currentLocation: "Distribution Center, Chicago, IL",
    timeline: [
      {
        date: "May 15, 2023",
        time: "10:30 AM",
        status: "Placed",
        completed: true,
      },
      {
        date: "May 15, 2023",
        time: "2:45 PM",
        status: "Approved",
        completed: true,
      },
      {
        date: "May 16, 2023",
        time: "9:15 AM",
        status: "Processed",
        completed: true,
      },
      {
        date: "May 16, 2023",
        time: "5:30 PM",
        status: "Shipped",
        completed: true,
      },
      {
        date: "May 18, 2023",
        time: "9:00 AM",
        status: "Delivered",
        completed: false,
      },
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    contactInfo: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com",
    },
  },
  {
    id: "ORD-12346",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800 border-green-200",
    date: "May 10, 2023",
    estimatedDelivery: "May 13, 2023",
    items: [{ name: "Product C", quantity: 1, price: "$79.99" }],
    total: "$79.99",
    trackingNumber: "TRK123456789",
    carrier: "UPS",
    currentLocation: "Delivered to Customer",
    timeline: [
      {
        date: "May 10, 2023",
        time: "3:20 PM",
        status: "Placed",
        completed: true,
      },
      {
        date: "May 10, 2023",
        time: "5:45 PM",
        status: "Approved",
        completed: true,
      },
      {
        date: "May 11, 2023",
        time: "10:15 AM",
        status: "Processed",
        completed: true,
      },
      {
        date: "May 11, 2023",
        time: "4:30 PM",
        status: "Shipped",
        completed: true,
      },
      {
        date: "May 13, 2023",
        time: "11:00 AM",
        status: "Delivered",
        completed: true,
      },
    ],
    shippingAddress: "456 Oak Ave, New York, NY 10002",
    contactInfo: {
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@example.com",
    },
  },
  {
    id: "ORD-12347",
    status: "Processing",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    date: "May 17, 2023",
    estimatedDelivery: "May 21, 2023",
    items: [
      { name: "Product D", quantity: 1, price: "$99.99" },
      { name: "Product E", quantity: 1, price: "$59.99" },
    ],
    total: "$159.98",
    trackingNumber: "TRK456789123",
    carrier: "USPS",
    currentLocation: "Processing Facility, Atlanta, GA",
    timeline: [
      {
        date: "May 17, 2023",
        time: "9:15 AM",
        status: "Placed",
        completed: true,
      },
      {
        date: "May 17, 2023",
        time: "11:30 AM",
        status: "Approved",
        completed: true,
      },
      {
        date: "May 17, 2023",
        time: "4:45 PM",
        status: "Processed",
        completed: true,
      },
      {
        date: "May 19, 2023",
        time: "10:00 AM",
        status: "Shipped",
        completed: false,
      },
      {
        date: "May 21, 2023",
        time: "1:00 PM",
        status: "Delivered",
        completed: false,
      },
    ],
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    contactInfo: {
      name: "Robert Johnson",
      phone: "+1 (555) 234-5678",
      email: "robert.johnson@example.com",
    },
  },
  {
    id: "ORD-12348",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    date: "May 18, 2023",
    estimatedDelivery: "May 23, 2023",
    items: [
      { name: "Product F", quantity: 2, price: "$69.99" },
      { name: "Product G", quantity: 1, price: "$49.99" },
      { name: "Product H", quantity: 1, price: "$29.99" },
    ],
    total: "$249.96",
    trackingNumber: "Not available yet",
    carrier: "Not assigned",
    currentLocation: "Awaiting Processing",
    timeline: [
      {
        date: "May 18, 2023",
        time: "2:30 PM",
        status: "Placed",
        completed: true,
      },
      {
        date: "Pending",
        time: "Pending",
        status: "Approved",
        completed: false,
      },
      {
        date: "Pending",
        time: "Pending",
        status: "Processed",
        completed: false,
      },
      { date: "Pending", time: "Pending", status: "Shipped", completed: false },
      {
        date: "Pending",
        time: "Pending",
        status: "Delivered",
        completed: false,
      },
    ],
    shippingAddress: "321 Elm St, Los Angeles, CA 90001",
    contactInfo: {
      name: "Sarah Williams",
      phone: "+1 (555) 876-5432",
      email: "sarah.williams@example.com",
    },
  },
];

// Status color mapping
const statusColorMap: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  "In Transit": "bg-indigo-100 text-indigo-800 border-indigo-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

// Format current date and time
const formatDateTime = (): { date: string; time: string } => {
  const now = new Date();
  return {
    date: now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };
};

// Calculate estimated delivery date (always 1 week from order date)
const calculateEstimatedDelivery = (): string => {
  const now = new Date();
  // Add 7 days to current date for estimated delivery
  const estimatedDate = new Date(now);
  estimatedDate.setDate(now.getDate() + 7);
  
  // Format the date as "Month Day, Year"
  return estimatedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Order service
export const OrderService = {
  // Get all orders
  getAllOrders: (): Order[] => {
    return [...orders];
  },

  // Get order by ID
  getOrderById: (id: string): Order | undefined => {
    return orders.find((order) => order.id === id);
  },

  // Get orders for a specific user (in a real app this would filter by user ID)
  getUserOrders: (): Order[] => {
    return [...orders];
  },

  // Update order status
  updateOrderStatus: (
    id: string,
    status: string,
    estimatedDelivery?: string,
  ): Order | undefined => {
    const orderIndex = orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) return undefined;

    const order = orders[orderIndex];
    const currentDateTime = formatDateTime();

    // Update order status, color, and estimated delivery date if provided
    orders[orderIndex] = {
      ...order,
      status,
      statusColor:
        statusColorMap[status] || "bg-gray-100 text-gray-800 border-gray-200",
      estimatedDelivery: estimatedDelivery || order.estimatedDelivery,
    };

    // Update timeline based on status change
    const statusSteps = [
      "Placed",
      "Approved",
      "Processed",
      "Shipped",
      "Delivered",
    ];
    const statusIndex = statusSteps.indexOf(status);

    if (statusIndex !== -1) {
      // Update the timeline for the current status and all previous statuses
      for (let i = 0; i <= statusIndex && i < order.timeline.length; i++) {
        if (i === statusIndex) {
          // Update the current status step with current date and time
          orders[orderIndex].timeline[i] = {
            date: currentDateTime.date,
            time: currentDateTime.time,
            status: statusSteps[i],
            completed: true,
          };
        } else if (!order.timeline[i].completed) {
          // Mark previous steps as completed if they weren't already
          orders[orderIndex].timeline[i].completed = true;
        }
      }
    }

    return orders[orderIndex];
  },

  // Update estimated delivery date
  updateEstimatedDelivery: (
    id: string,
    estimatedDelivery: string,
  ): Order | undefined => {
    const orderIndex = orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) return undefined;

    // Update the estimated delivery date
    orders[orderIndex].estimatedDelivery = estimatedDelivery;

    return orders[orderIndex];
  },

  // Create a new order
  createOrder: (
    items: OrderItem[],
    shippingAddress: string,
    contactInfo: ContactInfo
  ): Order => {
    const currentDateTime = formatDateTime();
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`; // Generate a random order ID
    const estimatedDelivery = calculateEstimatedDelivery();
    
    // Calculate total
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const newOrder: Order = {
      id: orderId,
      status: "Pending",
      statusColor: statusColorMap["Pending"],
      date: currentDateTime.date,
      estimatedDelivery: estimatedDelivery,
      items: [...items],
      total: `$${total.toFixed(2)}`,
      trackingNumber: "Not available yet",
      carrier: "Not assigned",
      currentLocation: "Awaiting Processing",
      timeline: [
        {
          date: currentDateTime.date,
          time: currentDateTime.time,
          status: "Placed",
          completed: true,
        },
        {
          date: "Pending",
          time: "Pending",
          status: "Approved",
          completed: false,
        },
        {
          date: "Pending",
          time: "Pending",
          status: "Processed",
          completed: false,
        },
        { 
          date: "Pending", 
          time: "Pending", 
          status: "Shipped", 
          completed: false 
        },
        {
          date: "Pending",
          time: "Pending",
          status: "Delivered",
          completed: false,
        },
      ],
      shippingAddress: shippingAddress,
      contactInfo: contactInfo,
    };
    
    // Add the new order to the orders array
    orders.push(newOrder);
    
    return newOrder;
  },
};
