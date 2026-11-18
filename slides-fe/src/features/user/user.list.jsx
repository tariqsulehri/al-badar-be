import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/apis/userService";
import { errorMessage } from "../../services/axios";
import { showToastNotification } from "../../helpers/notificationsHepler";
import { useCurrentUser } from "../../utils/utilAuth";
import { DeleteIcon, PersonAddIcon } from "../../components/icons";
import LoaderSpinner from "../../components/common/loader/loader.spinner";

const ROLE_STYLES = {
  admin: "chip--info",
  manager: "chip--brand",
  user: "chip--neutral",
};

const UserList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  const { data: users = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const removeUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showToastNotification("success", "User deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => showToastNotification("error", errorMessage(error, "Could not delete user")),
  });

  const handleDelete = (user) => {
    if (window.confirm(`Delete user "${user.username}"? This can't be undone.`)) {
      removeUser.mutate(user._id);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-soft bg-bg-surface px-5 py-4 shadow-soft">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Users</h1>
          <p className="text-sm text-text-secondary">
            {isLoading ? "Loading…" : `${users.length} account${users.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/users/create")}
          className="flex h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-[13px] font-medium text-on-brand transition-colors hover:bg-brand-strong"
        >
          <PersonAddIcon fontSize="small" /> Create user
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border-soft bg-bg-surface shadow-soft">
        {isLoading ? (
          <div className="grid place-items-center p-10">
            <LoaderSpinner size={32} role="status" />
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-text-secondary">
            Could not load users.{" "}
            <button type="button" onClick={() => refetch()} className="font-semibold text-brand hover:underline">
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <p className="p-10 text-center text-sm text-text-secondary">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user._id === currentUser?._id;
                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="avatar" aria-hidden="true">{(user.username || "?").charAt(0).toUpperCase()}</span>
                          <div className="min-w-0">
                            <div className="cell-title truncate">
                              {user.username}
                              {isSelf && <span className="ml-2 text-xs font-normal text-text-muted">(you)</span>}
                            </div>
                            <div className="cell-meta truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`chip ${ROLE_STYLES[user.role] || ROLE_STYLES.user}`}>{user.role}</span>
                      </td>
                      <td>
                        <span className={`chip ${user.active === false ? "chip--neutral" : "chip--success"}`}>
                          {user.active === false ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={isSelf || removeUser.isLoading}
                          title={isSelf ? "You can't delete your own account" : `Delete ${user.username}`}
                          aria-label={`Delete ${user.username}`}
                          className="row-btn row-btn--danger"
                        >
                          <DeleteIcon fontSize="small" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserList;
