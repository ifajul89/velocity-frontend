import React, { useState } from "react";
import { Pencil, Trash2, X, Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Define Product type
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  stock: string;
  quantity: number;
}

const ManageProduct = () => {
  // Sample data
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "iPhone 14 Pro",
      brand: "Apple",
      price: 1099,
      category: "Electronics",
      stock: "In Stock",
      quantity: 50,
    },
    {
      id: 2,
      name: "AirPods Max",
      brand: "Apple",
      price: 549,
      category: "Electronics",
      stock: "Out of Stock",
      quantity: 0,
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      brand: "Apple",
      price: 2499,
      category: "Electronics",
      stock: "In Stock",
      quantity: 15,
    },
    {
      id: 4,
      name: "Samsung Galaxy S23",
      brand: "Samsung",
      price: 999,
      category: "Electronics",
      stock: "In Stock",
      quantity: 30,
    },
  ]);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Add state for mobile sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
      );
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!editingProduct) return;

    const { name, value } = e.target;

    const updatedValue =
      name === "price" || name === "quantity" ? Number(value) : value;

    setEditingProduct({
      ...editingProduct,
      [name]: updatedValue,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen w-full overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMobileSidebar}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <p className="text-gray-500">
              View, edit, and delete products in your inventory
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="bg-opacity-50 fixed inset-0 bg-black"
            onClick={toggleMobileSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-lg">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-blue-600 p-1 text-white">
                  <span className="text-xl font-bold">V</span>
                </div>
                <h1 className="text-xl font-bold">Velocity</h1>
              </div>
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/products"
                    className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-blue-600"
                  >
                    <span>Manage Products</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Orders Management</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Profile Settings</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                  >
                    <span>Settings</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, brand, or category..."
            className="w-full rounded-lg border border-gray-300 p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
          <svg
            className="absolute top-3.5 left-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="rounded bg-yellow-400 p-1">📦</span>
            Manage Products
          </h2>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 font-semibold text-gray-600">
                <tr>
                  <th className="hidden px-4 py-3 sm:table-cell">#</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="hidden px-4 py-3 md:table-cell">Brand</th>
                  <th className="px-4 py-3">Price ($)</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Category</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Stock</th>
                  <th className="hidden px-4 py-3 md:table-cell">Quantity</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {product.brand}
                    </td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {product.category}
                    </td>
                    <td
                      className={`hidden px-4 py-3 sm:table-cell ${product.stock === "In Stock" ? "text-green-600" : "text-red-500"}`}
                    >
                      {product.stock}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {product.quantity}
                    </td>
                    <td className="flex justify-center gap-2 px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t bg-gray-50">
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-sm text-gray-500">
                    Showing {filteredProducts.length} of {products.length}{" "}
                    products
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-medium">Edit Product</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    name="name"
                    value={editingProduct.name}
                    onChange={handleInputChange}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    name="brand"
                    value={editingProduct.brand}
                    onChange={handleInputChange}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      name="price"
                      type="number"
                      value={editingProduct.price}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      name="quantity"
                      type="number"
                      value={editingProduct.quantity}
                      onChange={handleInputChange}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    name="category"
                    value={editingProduct.category}
                    onChange={handleInputChange}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Stock Status
                  </label>
                  <select
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleInputChange}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
