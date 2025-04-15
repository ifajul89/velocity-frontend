import React, { useState } from "react";
import { User, Mail, Shield, Ban, Edit2, Save, Lock, X } from "lucide-react";
import { AppSidebar } from "@/components/Dashboard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  useUpdateUserMutation,
  useChangePasswordMutation,
} from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/features/auth/authSlice";

// Simple Alert component implementation
const Alert = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={`rounded-md p-4 ${className}`}>{children}</div>;
};

const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

interface ProfileSection {
  id: string;
  title: string;
  fields: {
    id: string;
    label: string;
    value: string;
    icon: React.ReactNode;
    editable: boolean;
  }[];
}

// Define a type for the API response
interface ApiResponse {
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: {
    user?: {
      name?: string;
      email?: string;
      createdAt?: string;
      updatedAt?: string;
    };
    name?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  console.log("Auth user object:", user);
  console.log("User ID:", userId);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  // Initialize formData with user info directly from Redux state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "user",
    isBlocked: false,
    createdAt: user?.createdAt || "",
    updatedAt: user?.updatedAt || "",
  });

  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "", // For verification
  });

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const profileSections: ProfileSection[] = [
    {
      id: "userInfo",
      title: "User Information",
      fields: [
        {
          id: "name",
          label: "Name",
          value: formData.name,
          icon: <User className="h-4 w-4" />,
          editable: true,
        },
        {
          id: "email",
          label: "Email",
          value: formData.email,
          icon: <Mail className="h-4 w-4" />,
          editable: true,
        },
        {
          id: "role",
          label: "Role",
          value: formData.role,
          icon: <Shield className="h-4 w-4" />,
          editable: false,
        },
      ],
    },
    {
      id: "accountStatus",
      title: "Account Status",
      fields: [
        {
          id: "isBlocked",
          label: "Block Status",
          value: formData.isBlocked ? "Blocked" : "Active",
          icon: <Ban className="h-4 w-4" />,
          editable: false,
        },
      ],
    },
  ];

  const handleEditClick = () => {
    setEditFormData({
      name: formData.name,
      email: formData.email,
      password: "",
    });
    setShowEditDialog(true);
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleEditSave = async () => {
    try {
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      if (isUpdating) {
        return; // Prevent multiple submissions
      }

      const userData = {
        name: editFormData.name,
        email: editFormData.email,
        password: editFormData.password, // For verification
      };

      const response = await updateUser({
        id: userId,
        userData,
      }).unwrap();

      console.log("Server response:", response);

      // Type assertion for the response with proper type
      const typedResponse = response as ApiResponse;

      // Check for different possible response formats
      if (typedResponse.success || typedResponse.status) {
        // Extract updated user data, which might be in different locations
        // depending on the API response format
        const updatedUserData =
          typedResponse.data?.user || typedResponse.data || {};

        // Update local form data
        setFormData({
          ...formData,
          name: updatedUserData.name || userData.name,
          email: updatedUserData.email || userData.email,
        });

        // Update Redux state with new user data
        const updatedUser = {
          ...user,
          name: updatedUserData.name || userData.name,
          email: updatedUserData.email || userData.email,
        };

        dispatch(
          setUser({
            user: updatedUser,
            token: token,
          }),
        );

        toast.success(typedResponse.message || "Profile updated successfully");
        setShowEditDialog(false);
      } else {
        toast.error(typedResponse.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
      console.error(error);
    }
  };

  const handlePasswordChange = async () => {
    // Reset messages
    setPasswordError("");
    setPasswordSuccess("");

    // Validate inputs
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      if (!userId) {
        setPasswordError("User ID not found. Please log in again.");
        return;
      }

      if (isChangingPassword) {
        setPasswordError("Please wait, password change is in progress");
        return;
      }

      const passwordData = {
        currentPassword,
        newPassword,
      };

      const response = await changePassword({
        id: userId,
        passwordData,
      }).unwrap();

      console.log("Password change response:", response);

      // Type assertion for the response with proper type
      const typedResponse = response as ApiResponse;

      // Check for different possible response formats
      if (typedResponse.success || typedResponse.status) {
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess(
          typedResponse.message || "Password changed successfully!",
        );
        toast.success(
          typedResponse.message || "Password changed successfully!",
        );
      } else {
        setPasswordError(typedResponse.message || "Failed to update password");
        toast.error(typedResponse.message || "Failed to update password");
      }
    } catch (error) {
      setPasswordError("An error occurred while updating password");
      console.error(error);
      toast.error("An error occurred while updating password");
    }
  };

  // If user is not loaded
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          User not found. Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>User Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="container mx-auto p-6">
          <div className="grid gap-6">
            {/* Profile Header */}
            <div>
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800 text-3xl font-semibold text-white">
                    {formData.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold">{formData.name}</h1>
                    <p className="text-muted-foreground">{formData.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Dialog */}
            {showEditDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                    <button
                      onClick={() => setShowEditDialog(false)}
                      className="text-muted-foreground hover:text-foreground"
                      disabled={isUpdating}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border p-2"
                        value={editFormData.name}
                        onChange={(e) =>
                          handleEditFormChange("name", e.target.value)
                        }
                        disabled={isUpdating}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-md border p-2"
                        value={editFormData.email}
                        onChange={(e) =>
                          handleEditFormChange("email", e.target.value)
                        }
                        disabled={isUpdating}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Password (for verification)
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-md border p-2"
                        value={editFormData.password}
                        onChange={(e) =>
                          handleEditFormChange("password", e.target.value)
                        }
                        placeholder="Enter your password to confirm changes"
                        disabled={isUpdating}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleEditSave}
                      className="flex items-center gap-2"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <span className="mr-2 animate-spin">⟳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* User Information */}
            <div>
              <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">User Information</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="flex items-center gap-1 rounded-full border-red-500 bg-red-500 px-4 text-white hover:border-red-600 hover:bg-red-600"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  {profileSections[0].fields.map((field) => (
                    <div key={field.id} className="flex items-start gap-4 py-2">
                      <div className="text-muted-foreground mt-1">
                        {field.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">
                          {field.label}
                        </div>
                        <div className="mt-1">{field.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Status Section */}
              <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">
                  {profileSections[1].title}
                </h2>
                <div className="space-y-4">
                  {profileSections[1].fields.map((field) => (
                    <div key={field.id} className="flex items-start gap-4 py-2">
                      <div className="text-muted-foreground mt-1">
                        {field.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">
                          {field.label}
                        </div>
                        <div className="mt-1">{field.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Change Password</h2>

              {passwordError && (
                <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              {passwordSuccess && (
                <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{passwordSuccess}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md border p-2"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md border p-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-500">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md border p-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>

                <div>
                  <Button
                    onClick={handlePasswordChange}
                    className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <span className="mr-2 animate-spin">⟳</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
