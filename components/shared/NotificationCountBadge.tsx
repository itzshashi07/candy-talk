import Image from "next/image";

const NotificationCountBadge = ({ count, positionClasses }: any) => {
  return (
    <div className="relative">
      {count > 0 && (
        <div className={`absolute z-10 ${positionClasses} flex`}>
          <Image
            alt="icon"
            height={19}
            width={19}
            src="/assets/icons/noti.png"
          />

          <div
            className={`-top-3 left-2 h-4 w-4 absolute rounded-full flex items-center justify-center bg-primary-500  text-white`}
          >
            <small className="text-[0.6rem]">{count}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCountBadge;
