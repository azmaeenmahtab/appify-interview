import React from "react";

interface StoryCardProps {
  background: string;
  profilePic: string;
  name: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ background, profilePic, name }) => {
  return (
    <div className="relative shrink-0 w-[140px] h-[155px] rounded-lg overflow-hidden shadow bg-white flex flex-col justify-end" style={{backgroundImage:`url(${background})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
      {/* Profile picture at top right */}
      <div className="absolute top-2 right-2">
        <img src={profilePic} alt={name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
      </div>
      {/* Name at bottom */}
      <div className="w-full pb-3 px-3">
        <span className="text-white font-semibold text-base drop-shadow-lg">{name}</span>
      </div>
      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};

export default StoryCard;