
import { useMemo, useState } from "react";
import { useDeletedDrivers } from "../../hooks/useDashboard";

import Table from "../../components/common/Table";
import SearchInput from "../../components/common/SearchInput";
import ErrorMessage from "../../components/common/ErrorMessage";

const DeletedDrivers = () => {
  const [search, setSearch] = useState("");

  const {
    data: drivers = [],
    isLoading,
    isError,
    error,
  } = useDeletedDrivers();
  console.log(drivers)

  const filteredDrivers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) return drivers;

    return drivers.filter((driver) =>
      [
        driver.driver_name,
        driver.email,
        driver.phone_number,
        driver.license_number,
        driver.vehicle_number,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchValue)
    );
  }, [drivers, search]);

  const columns = [
    
{
  key: "profile_avatar",
  header: "Profile",
  render: (driver) => (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
      {driver.profile_avatar ? (
        <img
          src={driver.profile_avatar}
          alt={driver.driver_name}
          className="h-full w-full object-cover"
        />
      ) : (
        driver.driver_name?.charAt(0)?.toUpperCase() || "D"
      )}
    </div>
  ),
},

    {
      key: "driver_name",
      header: "Driver Name",
      render: (driver) => (
        <span className="font-medium text-gray-800">
          {driver.driver_name}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "phone_number",
      header: "Phone Number",
    },
    {
      key: "license_number",
      header: "License Number",
    },
    {
      key: "vehicle_number",
      header: "Vehicle Number",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Deleted Drivers
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View driver records that have been soft deleted.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-800">
            Deleted Driver Records
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Total: {drivers.length} deleted drivers
          </p>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search deleted drivers..."
        />
      </div>

      {isError ? (
        <ErrorMessage
          message={
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load deleted drivers."
          }
        />
      ) : (
        <Table
          columns={columns}
          data={filteredDrivers}
          isLoading={isLoading}
          pageSize={10}
          emptyTitle="No deleted drivers found"
          emptyDescription="Deleted driver records will appear here."
        />
      )}
    </div>
  );
};

export default DeletedDrivers;
