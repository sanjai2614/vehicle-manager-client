import { useMemo, useState, useEffect } from "react";
import { useUsers, useUpdateUserStatus } from "../../hooks/useDashboard";

import Table from "../../components/common/Table";
import SearchInput from "../../components/common/SearchInput";
import StatusToggle from "../../components/common/StatusToggle";
import { showToast } from "../../utils/toast";

const getApiErrorMessage = (error, fallback) => {
  const data = error.response?.data;

  if (typeof data === "string") return data;

  if (data) {
    const firstError = Object.values(data)
      .flat(Infinity)
      .find((item) => typeof item === "string");

    if (firstError) return firstError;
  }

  if (!error.response) return "Unable to connect to the server.";

  return fallback;
};

const Users = () => {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading, isError, error } = useUsers();

  const updateStatusMutation = useUpdateUserStatus();

  useEffect(() => {
    if (isError) {
      showToast.error(getApiErrorMessage(error, "Failed to load users."));
    }
  }, [isError, error]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) return users;

    return users.filter((user) =>
      [user.username, user.first_name, user.last_name, user.email, user.role]
        .join(" ")
        .toLowerCase()
        .includes(searchValue),
    );
  }, [users, search]);

  const handleStatusChange = (user) => {
    updateStatusMutation.mutate(
      {
        id: user.id,
        is_active: !user.is_active,
      },
      {
        onSuccess: () => {
          showToast.success(
            `User ${!user.is_active ? "activated" : "deactivated"} successfully!`,
          );
        },
        onError: (error) => {
          showToast.error(
            getApiErrorMessage(error, "Unable to update user status."),
          );
        },
      },
    );
  };

  const columns = [
    {
      key: "profile",
      header: "Profile",
      render: (user) => {
        const fullName =
          `${user.first_name || ""} ${user.last_name || ""}`.trim();
        const initials = (fullName || user.username || "U")
          .charAt(0)
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {user.profile_avatar ? (
                <img
                  src={user.profile_avatar}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>
        );
      },
    },

    {
      key: "username",
      header: "Username",
      render: (user) => (
        <span className="font-medium text-gray-800">{user.username}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "full_name",
      header: "Full Name",
      render: (user) =>
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || "-",
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            user.is_active
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {user.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (user) => (
        <StatusToggle
          checked={user.is_active}
          onChange={() => handleStatusChange(user)}
          disabled={updateStatusMutation.isPending}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage registered users and their account status.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">All Users</h2>
          <p className="mt-1 text-sm text-gray-500">
            Total: {users.length} users
          </p>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search users..."
        />
      </div>

      <Table
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading || isError}
        pageSize={10}
        emptyTitle="No users found"
        emptyDescription="No users match your search."
      />
    </div>
  );
};

export default Users;
