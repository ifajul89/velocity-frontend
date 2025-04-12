import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Edit2,
  Save,
} from "lucide-react";
// import { AppSidebar } from "@/components/Dashboard";
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

export default function ProfilePage() {
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    company: "Acme Corporation",
    dateJoined: "January 15, 2023",
    role: "Administrator",
    department: "Engineering",
    bio: "Experienced professional with a passion for technology and innovation.",
  });

  // Store original data on initial load
  useEffect(() => {
    setOriginalData({ ...formData });
  }, []);

  const profileSections: ProfileSection[] = [
    {
      id: "personal",
      title: "Personal Information",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          value: formData.fullName,
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
          id: "phone",
          label: "Phone",
          value: formData.phone,
          icon: <Phone className="h-4 w-4" />,
          editable: true,
        },
        {
          id: "address",
          label: "Address",
          value: formData.address,
          icon: <MapPin className="h-4 w-4" />,
          editable: true,
        },
      ],
    },
    {
      id: "work",
      title: "Work Information",
      fields: [
        {
          id: "company",
          label: "Company",
          value: formData.company,
          icon: <Building className="h-4 w-4" />,
          editable: true,
        },
        {
          id: "dateJoined",
          label: "Date Joined",
          value: formData.dateJoined,
          icon: <Calendar className="h-4 w-4" />,
          editable: false,
        },
        {
          id: "role",
          label: "Role",
          value: formData.role,
          icon: <User className="h-4 w-4" />,
          editable: true,
        },
        {
          id: "department",
          label: "Department",
          value: formData.department,
          icon: <Building className="h-4 w-4" />,
          editable: true,
        },
      ],
    },
  ];

  const handleEdit = (sectionId: string, fieldId: string) => {
    setEditing({
      ...editing,
      [`${sectionId}-${fieldId}`]: !editing[`${sectionId}-${fieldId}`],
    });
  };

  const handleChange = (fieldId: string, value: string) => {
    const newFormData = {
      ...formData,
      [fieldId]: value,
    };
    setFormData(newFormData);

    // Check if data has changed compared to original
    setHasChanges(JSON.stringify(newFormData) !== JSON.stringify(originalData));
  };

  const handleSave = () => {
    // Save the changes (this would normally connect to an API)
    console.log("Saving changes:", formData);
    setOriginalData({ ...formData });
    setHasChanges(false);

    // Close any open edit fields
    setEditing({});
  };

  return (
    <SidebarProvider>
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
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Header */}
            <div className="md:col-span-3">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold">
                    {formData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold">{formData.fullName}</h1>
                    <p className="text-muted-foreground">
                      {formData.role} • {formData.department}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {formData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Column */}
            <div className="space-y-6 md:col-span-2">
              {profileSections.map((section) => (
                <div
                  key={section.id}
                  className="bg-card rounded-xl p-6 shadow-sm"
                >
                  <h2 className="mb-4 text-xl font-semibold">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id} className="flex items-start gap-4">
                        <div className="text-muted-foreground mt-1">
                          {field.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-muted-foreground text-sm">
                            {field.label}
                          </div>
                          {editing[`${section.id}-${field.id}`] ? (
                            <input
                              type="text"
                              className="mt-1 w-full rounded-md border p-1"
                              value={
                                formData[field.id as keyof typeof formData]
                              }
                              onChange={(e) =>
                                handleChange(field.id, e.target.value)
                              }
                            />
                          ) : (
                            <div className="mt-1">{field.value}</div>
                          )}
                        </div>
                        {field.editable && (
                          <button
                            onClick={() => handleEdit(section.id, field.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {editing[`${section.id}-${field.id}`] ? (
                              <Save className="h-4 w-4" />
                            ) : (
                              <Edit2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Bio</h2>
                <div className="relative">
                  {editing["bio"] ? (
                    <div>
                      <textarea
                        className="min-h-24 w-full rounded-md border p-2"
                        value={formData.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                      />
                      <button
                        onClick={() => setEditing({ ...editing, bio: false })}
                        className="text-muted-foreground hover:text-foreground absolute top-2 right-2"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground">{formData.bio}</p>
                      <button
                        onClick={() => setEditing({ ...editing, bio: true })}
                        className="text-muted-foreground hover:text-foreground absolute top-0 right-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Account Info</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Member Since
                    </span>
                    <span>{formData.dateJoined}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Account Status
                    </span>
                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Last Login
                    </span>
                    <span>Today, 2:45 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="mt-6 flex justify-end">
            <Button
              disabled={!hasChanges}
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
