import React from "react";

interface EventCardProps {
  image: string;
  date: string;
  month: string;
  title: string;
  peopleGoing: number;
}

const EventCard: React.FC<EventCardProps> = ({
  image,
  date,
  month,
  title,
  peopleGoing,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-0 overflow-hidden max-w-sm">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex flex-col items-center justify-center bg-green-500 rounded-md px-2 py-1 text-white font-bold text-sm">
            <span>{date}</span>
            <span className="text-xs font-normal">{month}</span>
          </div>
          <div className="text-black font-semibold text-lg">{title}</div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <span className="text-gray-400 text-sm">{peopleGoing} People Going</span>
          <button className="border border-blue-500 text-blue-500 rounded px-4 py-1 font-medium bg-white hover:bg-blue-50">Going</button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;