import { useNavigate } from "react-router";
import { useSession, signOut } from "../../lib/auth-client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";

import ProfileAvatar from "../components/ProfileAvatar";

export default function ProfileDashboard() {
  const navigate = useNavigate();

  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  if (!session) {
    navigate("/login");
    return null;
  }

  const user = session.user;

  const handleLogout = async () => {
    await signOut();

    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4">
          <ProfileAvatar user={user} />

          <CardTitle>
            Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="bg-gray-200 px-4 py-1">
            <p className="text-sm text-muted-foreground">
              Name
            </p>

            <p className="font-medium">
              {user.name}
            </p>
          </div>

          <div className="bg-gray-200 px-4 py-1">
            <p className="text-sm text-muted-foreground">
              Email
            </p>

            <p className="font-medium">
              {user.email}
            </p>
          </div>

          <Button
            variant="destructive"
            className="w-full mt-4"
            onClick={handleLogout}
          >
            Sign Out
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}