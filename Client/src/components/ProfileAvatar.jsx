import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useNavigate } from "react-router";
export default function ProfileAvatar({ user }) {
  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navigate = useNavigate();

  return (
    <Avatar
    onClick = {()=> navigate("/dashboard")}
    className="h-10 w-10 cursor-pointer">
      <AvatarImage
        src={user?.image || ""}
        alt={user?.name}
      />
      <AvatarFallback>
        {initials || "U"}
      </AvatarFallback>
    </Avatar>
  );
}