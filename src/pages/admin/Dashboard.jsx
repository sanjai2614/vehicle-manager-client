
import {
  Users,
  UserCheck,
  UserX,
  CarFront,
  Trash2,
} from "lucide-react";

import {
  useUsers,
  useAllDrivers,
  useDeletedDrivers,
} from "../../hooks/useDashboard";

import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const usersQuery = useUsers();
  const driversQuery = useAllDrivers();
  const deletedDriversQuery = useDeletedDrivers();

  const users = usersQuery.data || [];
  const drivers = driversQuery.data || [];
  const deletedDrivers = deletedDriversQuery.data || [];

  const isLoading =
    usersQuery.isLoading ||
    driversQuery.isLoading ||
    deletedDriversQuery.isLoading;

  const isError =
    usersQuery.isError ||
    driversQuery.isError ||
    deletedDriversQuery.isError;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Users",
      value: users.filter((user) => user.is_active).length,
      icon: UserCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Inactive Users",
      value: users.filter((user) => !user.is_active).length,
      icon: UserX,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Active Drivers",
      value: drivers.length,
      icon: CarFront,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Deleted Drivers",
      value: deletedDrivers.length,
      icon: Trash2,
      color: "bg-red-50 text-red-600",
    },
  ];

  if (isLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  if (isError) {
    return (
      <ErrorMessage message="Failed to load dashboard statistics." />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of users and driver management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-gray-800">
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
