import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Users, Upload, ImagePlus, Save, X } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import SearchInput from "../../components/common/SearchInput";
import ActionButtons from "../../components/common/ActionButtons";

import { driverSchema } from "../../validations/driver.validation";
import {
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from "../../hooks/useDrivers";
import { showToast } from "../../utils/toast";

const initialValues = {
  driver_name: "",
  age: "",
  email: "",
  phone_number: "",
  license_number: "",
  vehicle_number: "",
  profile_avatar: undefined,
};

const getApiErrorMessage = (error, fallback) => {
  const data = error.response?.data;

  if (typeof data === "string") return data;

  if (data) {
    const firstError = Object.values(data)
      .flat(Infinity)
      .find((item) => typeof item === "string");

    if (firstError) return firstError;
  }

  if (!error.response) {
    return "Unable to connect to the server.";
  }

  return fallback;
};

const Drivers = () => {
  const { data: drivers = [], isLoading, isError, error } = useDrivers();

  const createMutation = useCreateDriver();
  const updateMutation = useUpdateDriver();
  const deleteMutation = useDeleteDriver();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: initialValues,
  });

  const selectedAvatar = watch("profile_avatar");

  // Avatar preview
  useEffect(() => {
    if (!selectedAvatar?.[0]) return;

    const previewUrl = URL.createObjectURL(selectedAvatar[0]);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedAvatar]);

  useEffect(() => {
    if (isError) {
      showToast.error(getApiErrorMessage(error, "Unable to load drivers."));
    }
  }, [isError, error]);

  // Search
  const filteredDrivers = drivers.filter((driver) =>
    [
      driver.driver_name,
      driver.age,
      driver.email,
      driver.phone_number,
      driver.license_number,
      driver.vehicle_number,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Add driver avatar
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    setValue("profile_avatar", file ? [file] : undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (!file) {
      setAvatarPreview("");
    }
  };

  // Add driver
  const onSubmit = async (values) => {
    const formData = new FormData();

    formData.append("driver_name", values.driver_name);
    formData.append("age", values.age);
    formData.append("email", values.email);
    formData.append("phone_number", values.phone_number);
    formData.append("license_number", values.license_number);
    formData.append("vehicle_number", values.vehicle_number);

    if (values.profile_avatar?.[0]) {
      formData.append("profile_avatar", values.profile_avatar[0]);
    }

    try {
      await createMutation.mutateAsync(formData);

      reset(initialValues);
      setAvatarPreview("");

      showToast.success("Driver added successfully!");
    } catch (err) {
      showToast.error(getApiErrorMessage(err, "Unable to add driver."));
    }
  };

  // Start inline editing
  const handleEdit = (driver) => {
    setEditingId(driver.id);

    setEditData({
      driver_name: driver.driver_name || "",
      age: driver.age ?? "",
      email: driver.email || "",
      phone_number: driver.phone_number || "",
      license_number: driver.license_number || "",
      vehicle_number: driver.vehicle_number || "",
    });
  };

  // Update draft values
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Cancel inline editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Save inline changes
  const handleSaveEdit = async (id) => {
    const originalDriver = drivers.find((driver) => driver.id === id);

    if (!originalDriver) return;

    const changedFields = {};

    Object.keys(editData).forEach((field) => {
      const newValue =
        field === "age" ? Number(editData[field]) : editData[field]?.trim();

      const oldValue =
        field === "age" ? Number(originalDriver[field]) : originalDriver[field];

      if (newValue !== oldValue) {
        changedFields[field] = newValue;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      handleCancelEdit();
      return;
    }

    if (
      !editData.driver_name?.trim() ||
      !editData.email?.trim() ||
      !editData.phone_number?.trim() ||
      !editData.license_number?.trim() ||
      !editData.vehicle_number?.trim() ||
      !Number.isInteger(Number(editData.age)) ||
      Number(editData.age) < 18
    ) {
      showToast.error("Please enter valid driver details.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        payload: changedFields,
      });

      handleCancelEdit();
      showToast.success("Driver updated successfully!");
    } catch (err) {
      showToast.error(getApiErrorMessage(err, "Unable to update driver."));
    }
  };

  // Delete driver
  const handleDelete = async (driver) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${driver.driver_name}?`,
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(driver.id);

      if (editingId === driver.id) {
        handleCancelEdit();
      }

      showToast.success("Driver deleted successfully!");
    } catch (err) {
      showToast.error(getApiErrorMessage(err, "Unable to delete driver."));
    }
  };

  // Reusable inline input
  const renderEditInput = (driver, field, type = "text") => {
    const isEditing = editingId === driver.id;

    if (!isEditing) {
      return driver[field] ?? "-";
    }

    return (
      <input
        type={type}
        value={editData[field] ?? ""}
        onChange={(event) => handleEditChange(field, event.target.value)}
        className="w-full max-w-30 rounded-lg border border-blue-200 bg-blue-50/50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    );
  };

  // Table columns
  const columns = [
    {
      key: "driver_name",
      header: "Driver",
      render: (driver) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
            {driver.profile_avatar ? (
              <img
                src={driver.profile_avatar}
                alt={driver.driver_name}
                className="h-full w-full object-cover"
              />
            ) : (
              driver.driver_name?.charAt(0)?.toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            {renderEditInput(driver, "driver_name")}
          </div>
        </div>
      ),
    },
    {
      key: "age",
      header: "Age",
      render: (driver) => renderEditInput(driver, "age", "number"),
    },
    {
      key: "email",
      header: "Email",
      render: (driver) => renderEditInput(driver, "email", "email"),
    },
    {
      key: "phone_number",
      header: "Phone",
      render: (driver) => renderEditInput(driver, "phone_number"),
    },
    {
      key: "license_number",
      header: "License Number",
      render: (driver) => renderEditInput(driver, "license_number"),
    },
    {
      key: "vehicle_number",
      header: "Vehicle Number",
      render: (driver) => renderEditInput(driver, "vehicle_number"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (driver) =>
        editingId === driver.id ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSaveEdit(driver.id)}
              disabled={updateMutation.isPending}
              title="Save Changes"
              className="rounded-lg p-2 text-green-600 transition bg-green-100 hover:bg-green-200 disabled:opacity-50"
            >
              <Save size={17} />
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={updateMutation.isPending}
              title="Cancel"
              className="rounded-lg p-2 text-gray-500 transition bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              <X size={17} />
            </button>
          </div>
        ) : (
          <ActionButtons
            showView={false}
            onEdit={() => handleEdit(driver)}
            onDelete={() => handleDelete(driver)}
            disabled={deleteMutation.isPending || editingId !== null}
          />
        ),
    },
  ];

  const isSaving = createMutation.isPending;

  return (
    <div className="min-h-screen space-y-7 pb-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Users size={16} />
            Driver Management
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Drivers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your driver records.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700">
            <Users size={20} />
          </div>

          <div>
            <p className="text-xs text-gray-500">Total Drivers</p>
            <p className="text-xl font-bold text-gray-900">{drivers.length}</p>
          </div>
        </div>
      </div>

      {/* Add Driver Form */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
            <UserPlus size={20} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Add New Driver</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Enter the details to register a new driver.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-5 sm:p-6"
        >
          {/* Avatar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Driver preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus size={27} className="text-gray-400" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Driver Profile Photo
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Upload a JPG, PNG or WebP image.
              </p>

              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                <Upload size={15} />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <Input
              label="Driver Name"
              placeholder="Enter driver name"
              error={errors.driver_name?.message}
              {...register("driver_name")}
            />

            <Input
              label="Age"
              type="number"
              placeholder="Enter age"
              error={errors.age?.message}
              {...register("age")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              error={errors.phone_number?.message}
              {...register("phone_number")}
            />

            <Input
              label="License Number"
              placeholder="Enter license number"
              error={errors.license_number?.message}
              {...register("license_number")}
            />

            <Input
              label="Vehicle Number"
              placeholder="Enter vehicle number"
              error={errors.vehicle_number?.message}
              {...register("vehicle_number")}
            />
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-5">
            <Button type="submit" isLoading={isSaving}>
              <UserPlus size={17} />
              Add Driver
            </Button>
          </div>
        </form>
      </section>

      {/* Drivers Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Drivers List</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your registered drivers.
            </p>
          </div>

          <div className="w-full sm:max-w-xs">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search drivers..."
            />
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <Table
            columns={columns}
            data={filteredDrivers}
            getRowKey={(driver) => driver.id}
            isLoading={isLoading}
            emptyTitle="No drivers found"
            emptyDescription={
              search
                ? "Try searching with a different keyword."
                : "Add your first driver using the form above."
            }
          />
        </div>
      </section>
    </div>
  );
};

export default Drivers;
