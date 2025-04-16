import React, { useState, useEffect, useMemo } from "react";
import {
  AlertCircle,
  MoreHorizontal,
  Edit,
  X,
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { AppSidebar } from "@/components/Dashboard";
import { useAppSelector } from "@/redux/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useGetAllUsersQuery,
  useAdminUpdateUserMutation,
  useDeleteUserMutation,
} from "./userManagementApi";

// Define User type interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the authenticated user type to match auth slice structure
interface AuthUser {
  _id?: string;
  id?: string; // Support both _id and id fields
  name?: string;
  email?: string;
  role?: string;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, userData: Partial<User>) => void;
}

// EditUserModal component for editing user information
const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  console.log("User data in modal:", user);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.isBlocked ? "blocked" : "active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Submitting update for user ID:", user._id);

      if (!user._id) {
        throw new Error("User ID is missing");
      }

      // Validate user ID format
      if (typeof user._id !== "string" || user._id.trim() === "") {
        throw new Error("Invalid user ID format");
      }

      // Check network connectivity before submitting
      if (!navigator.onLine) {
        throw new Error(
          "No internet connection. Please check your network and try again.",
        );
      }

      await onSave(user._id, {
        name,
        email,
        role,
        isBlocked: status === "blocked",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      // Show a more user-friendly error message
      if (!navigator.onLine) {
        setError(
          "No internet connection. Please check your network and try again.",
        );
        toast.error(
          "No internet connection. Please check your network and try again.",
        );
      } else {
        setError("Failed to update user. Please try again.");
        toast.error("Failed to update user. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white shadow-lg">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-xl font-bold">Edit User</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              {user._id && (
                <div className="mt-1 rounded border bg-gray-50 p-2 text-sm text-gray-500">
                  <span className="font-semibold">User ID:</span> {user._id}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={role}
                    onValueChange={setRole}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="blocked">Deactivate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="mt-2 text-sm text-red-500">{error}</div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function UserManagementPage() {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const itemsPerPage = 10;
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Add network status monitoring
  useEffect(() => {
    const handleOnline = () => setNetworkError(null);
    const handleOffline = () =>
      setNetworkError(
        "You are currently offline. Some features may not work properly.",
      );

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setNetworkError(
        "You are currently offline. Some features may not work properly.",
      );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Get current user from state including token
  const currentUserData = useAppSelector(
    (state) => state.auth.user,
  ) as AuthUser;
  const authToken = useAppSelector((state) => state.auth.token);

  // Check if user has admin privileges
  const [adminAccessError, setAdminAccessError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserData && currentUserData.role !== "admin") {
      setAdminAccessError(
        "You don't have admin privileges. Some actions will be restricted.",
      );
    } else {
      setAdminAccessError(null);
    }
  }, [currentUserData]);

  // Log auth data for debugging
  useEffect(() => {
    console.log("Current auth token:", authToken);
    console.log("Current user:", currentUserData);
  }, [authToken, currentUserData]);

  // Set to false to use real API data
  const useMockData = false;

  // Get all users
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersQuery(undefined, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  // Use mutations
  const [updateUser] = useAdminUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Extract users from API response using useMemo to prevent unnecessary recalculations
  const allUsers = useMemo(() => {
    if (useMockData) {
      return Array(10)
        .fill(null)
        .map((_, index) => ({
          _id: `user-${index + 1}`,
          name: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          role: index === 0 ? "admin" : "user",
          isBlocked: index % 3 === 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
    }
    return usersData?.data || usersData?.users || [];
  }, [usersData, useMockData]);

  // Filter users based on search term and role using useMemo
  const filteredUsers = useMemo(() => {
    // Start with all users
    let filtered = [...allUsers];

    // Apply search term filter if not empty
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user: User) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply role filter if not "all"
    if (selectedRole !== "all") {
      if (selectedRole === "blocked") {
        filtered = filtered.filter((user: User) => user.isBlocked);
      } else {
        filtered = filtered.filter((user: User) => user.role === selectedRole);
      }
    }

    return filtered;
  }, [allUsers, searchTerm, selectedRole]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Generate page numbers array for pagination
  const pageNumbers = useMemo(() => {
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [totalPages]);

  // Log the users data to see the structure
  useEffect(() => {
    if (usersData) {
      console.log("Users data from API:", usersData);
    }
  }, [usersData]);

  const handleEditUser = (user: User) => {
    console.log("Selected user for editing:", user);
    console.log("User ID type:", typeof user._id);
    console.log("User ID value:", user._id);

    if (!user._id) {
      console.error("Cannot edit user with undefined ID");
      return;
    }

    // Make a copy of the user object to avoid reference issues
    const userToEdit = { ...user };
    console.log("User to edit with ID:", userToEdit._id);

    setEditUserData(userToEdit);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditUserData(null);
  };

  const handleSaveUser = async (userId: string, userData: Partial<User>) => {
    try {
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error(
          "No internet connection. Please check your network and try again.",
        );
      }

      // Verify current user has admin privileges
      if (currentUserData?.role !== "admin") {
        throw new Error(
          "Authentication error: You do not have admin privileges to update users.",
        );
      }

      console.log("Updating user with ID:", userId);
      console.log("Update data:", userData);

      if (!userId || userId.trim() === "") {
        throw new Error("User ID is required for update");
      }

      // Ensure userId is properly formatted and exists
      const sanitizedUserId = userId.trim();
      console.log("Sanitized User ID for API call:", sanitizedUserId);

      // Use the adminUpdateUser mutation instead
      const result = await updateUser({
        userId: sanitizedUserId,
        userData: {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isBlocked: userData.isBlocked,
        },
      }).unwrap();

      console.log("Update result:", result);

      // Close the modal and refresh data
      handleCloseEditModal();
      refetch();

      toast.success("User updated successfully");

      return result;
    } catch (error: unknown) {
      console.error("Failed to update user:", error);

      // Network error handling
      if (!navigator.onLine) {
        setNetworkError(
          "You are currently offline. Please check your internet connection.",
        );
        toast.error(
          "You are currently offline. Please check your internet connection.",
        );
      }

      if (typeof error === "object" && error !== null) {
        const err = error as FetchBaseQueryError | SerializedError;
        if ("status" in err) {
          console.error("Error status:", err.status);
          console.error("Error data:", JSON.stringify(err.data, null, 2));

          if (err.status === "FETCH_ERROR") {
            console.error("Network error: Failed to connect to the server");
            toast.error("Network error: Failed to connect to the server");
          } else if (err.status === 403) {
            setNetworkError(
              "Authentication error: You do not have permission to update this user.",
            );
            console.error(
              "Authentication error: You may not have permission to update this user.",
            );
            toast.error(
              "Authentication error: You do not have permission to update this user.",
            );
          } else {
            toast.error(`Error: Failed to update user (${err.status})`);
          }
        } else if ("message" in err) {
          console.error("Error message:", err.message);
          toast.error(`Error: ${err.message}`);
        }
      }

      toast.error("Failed to update user. Please try again.");

      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Verify current user has admin privileges
      if (currentUserData?.role !== "admin") {
        setNetworkError(
          "Authentication error: You do not have admin privileges to delete users.",
        );
        toast.error(
          "Authentication error: You do not have admin privileges to delete users.",
        );
        return;
      }

      console.log("Attempting to delete user with ID:", userId);

      if (!userId || userId.trim() === "") {
        throw new Error("User ID is required for delete operation");
      }

      // Ensure userId is properly formatted
      const sanitizedUserId = userId.trim();

      await deleteUser(sanitizedUserId).unwrap();
      console.log("User deleted successfully");

      // Show success message
      setNetworkError(null);
      refetch();

      toast.success("User deleted successfully");
    } catch (error: unknown) {
      console.error("Failed to delete user:", error);

      // Network error handling
      if (!navigator.onLine) {
        setNetworkError(
          "You are currently offline. Please check your internet connection.",
        );
        toast.error(
          "You are currently offline. Please check your internet connection.",
        );
      }

      if (typeof error === "object" && error !== null) {
        const err = error as FetchBaseQueryError | SerializedError;
        if ("status" in err) {
          console.error("Error status:", err.status);
          console.error("Error data:", JSON.stringify(err.data, null, 2));

          if (err.status === "FETCH_ERROR") {
            setNetworkError("Network error: Failed to connect to the server");
            toast.error("Network error: Failed to connect to the server");
          } else if (err.status === 403) {
            setNetworkError(
              "Authentication error: You do not have permission to delete this user.",
            );
            toast.error(
              "Authentication error: You do not have permission to delete this user.",
            );
          } else {
            setNetworkError(`Error: Failed to delete user (${err.status})`);
            toast.error(`Error: Failed to delete user (${err.status})`);
          }
        } else if ("message" in err) {
          setNetworkError(`Error: ${err.message}`);
          toast.error(`Error: ${err.message}`);
        }
      } else {
        setNetworkError(
          "An unknown error occurred while trying to delete the user",
        );
        toast.error(
          "An unknown error occurred while trying to delete the user",
        );
      }
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100">
        <AppSidebar />
        <main className="w-full flex-1">
          <div className="w-full px-4 py-6">
            {/* Show network error if present */}
            {networkError && (
              <div className="mb-4 flex items-center rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{networkError}</span>
              </div>
            )}

            {/* Show admin access error if present */}
            {adminAccessError && (
              <div className="mb-4 flex items-center rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{adminAccessError}</span>
              </div>
            )}

            <div className="mb-6 flex items-center">
              <SidebarTrigger className="mr-4" />
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>User Management</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <h1 className="mt-2 text-2xl font-bold">User Management</h1>
              </div>
            </div>

            <Card className="w-full">
              <CardHeader>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <CardTitle>Users</CardTitle>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="relative flex items-center">
                      <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-8 md:w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0"
                          onClick={() => setSearchTerm("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <Select
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Regular Users</SelectItem>
                        <SelectItem value="blocked">
                          Deactivated Users
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading && !useMockData ? (
                  <div className="py-8 text-left">
                    <p>Loading users...</p>
                  </div>
                ) : isError && !useMockData ? (
                  <div className="flex items-center justify-start gap-2 py-8 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    <p>Failed to load users. Please try again.</p>
                  </div>
                ) : currentUsers.length === 0 ? (
                  <div className="flex items-center justify-start gap-2 py-8 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    <p>No users found. Please try a different search.</p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="w-[100px]">Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created On</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentUsers.map((user: User) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium" title={user._id}>
                              {user._id}
                            </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "admin" ? "default" : "outline"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.isBlocked ? "destructive" : "secondary"
                                }
                              >
                                {user.isBlocked ? "Deactive" : "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(user.createdAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEditUser(user)}
                                    disabled={
                                      (currentUserData?._id ||
                                        currentUserData?.id) === user._id
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() => handleDeleteUser(user._id)}
                                    disabled={
                                      (currentUserData?._id ||
                                        currentUserData?.id) === user._id
                                    }
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {filteredUsers.length > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                      {filteredUsers.length} users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {pageNumbers.map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Edit User Modal */}
      {editModalVisible && editUserData && (
        <EditUserModal
          user={editUserData}
          onClose={handleCloseEditModal}
          onSave={handleSaveUser}
        />
      )}
    </SidebarProvider>
  );
}
