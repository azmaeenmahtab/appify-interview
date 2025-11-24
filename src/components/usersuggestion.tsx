import React from "react";

type Props = {
    profilePic: string;
    name: string;
    title: string;
}

const UserSuggestion: React.FC<Props> = ({ profilePic, name, title }) => {
  return (
    <div className="flex items-center gap-3">
        <img src={profilePic} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
            <div className="text-black font-medium">{name}</div>
            <div className="text-gray-500 text-sm">{title}</div>
        </div>
        <button className="bg-gray-100 border border-gray-300 rounded px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200">Connect</button>
    </div>
  );
}

export default UserSuggestion;