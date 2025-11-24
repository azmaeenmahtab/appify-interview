import React from 'react';

interface MightLikeProps {
    profilePic: string;
    name: string;
    title: string;
    onIgnore?: () => void;
    onFollow?: () => void;
}

const MightLike: React.FC<MightLikeProps> = ({
    profilePic,
    name,
    title,
    onIgnore,
    onFollow,
}) => (
    <div className="  bg-white   ">
        <div className='flex items-center mb-4'>
            <img
                src={profilePic}
                alt={name}
                className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
                <div className="font-semibold text-[16px] text-black">{name}</div>
                <div className="text-gray-500 text-[12px]">{title}</div>
            </div>
        </div>
        <div className="flex gap-3">
            
                <button
                    className="border max-w-[200px] w-full border-gray-300 rounded-lg px-4 py-1 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
                    onClick={onIgnore}
                >
                    Ignore
                </button>
                <button
                    className="border max-w-[200px] w-full border-gray-300 rounded-lg px-4 py-1 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
                    onClick={onFollow}
                >
                    Follow
                </button>
            
        </div>
    </div>
);

export default MightLike;