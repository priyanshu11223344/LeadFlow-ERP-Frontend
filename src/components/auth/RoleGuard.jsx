import { useAuth }
  from "../../context/AuthContext";

const RoleGuard = ({
  allowedRoles,
  children,
}) => {
  const { user } =
    useAuth();

  if (
    !allowedRoles.includes(
      user?.role
    )
  ) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-bold text-red-600">
          Access Denied
        </h2>

        <p className="text-gray-500 mt-2">
          You do not have permission
          to access this section.
        </p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;