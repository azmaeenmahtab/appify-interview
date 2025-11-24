import React from "react";

type Props = {
  profilePic: string;
  name: string;
  title: string;
  isActive: boolean;
  lastSeen?: string; // e.g. '5 min ago' or formatted time
}

const ShowFriend: React.FC<Props> = ({ profilePic, name, title, isActive, lastSeen }) => {
  return (
    <div className="flex items-center gap-3">
        <img src={profilePic} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
            <div className="text-black font-medium text-[16px]">{name}</div>
            <div className="text-gray-500 text-[12px]">{title}</div>
        </div>
        <div>
          {isActive ? (
            <span className="inline-block w-3 h-3 rounded-full bg-green-500" title="Active"></span>
          ) : (
            <span className="text-gray-400 text-xs">{lastSeen || 'Offline'}</span>
          )}
        </div>
    </div>
  );
}

export default ShowFriend;