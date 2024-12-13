import { useEffect, useState } from "react";
import axios from "axios";

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Online User</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => onSelectUser(user)}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
