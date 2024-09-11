import { getNotificationsCount } from "@/lib/actions/notification.action";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import NotificationCountBadge from "./NotificationCountBadge";

const NotificationCount = async () => {
  const { userId } = auth();
  if (!userId) return null;
  let mongoUser = await getUserById({ userId });

  const result = await getNotificationsCount({
    clerkId: mongoUser?._id,
  });

  return (
    <NotificationCountBadge
      count={result?.totalNotifications}
      positionClasses="-top-[23px] -right-[11.3rem]"
    />
  );
};

export default NotificationCount;
