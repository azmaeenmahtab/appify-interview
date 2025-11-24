import React from 'react';
import { FiEdit3 } from "react-icons/fi";


interface CreatePostProps {
	profilePic: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ profilePic }) => {
	return (
		<div className="bg-white rounded-xl p-4 shadow">
			<div className="flex items-center mb-[100px]">
				<img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover mr-3" />
                <div className='flex items-center'>
				<input
					type="text"
					placeholder={`Write something ...`}
					className="flex-1 bg-transparent outline-none text-gray-700 text-[18px] "
				/>
                <FiEdit3 className="text-gray-400 " />
                </div>
			</div>
			<div className="bg-blue-50 rounded-lg flex items-center justify-between px-4 py-3">
				<div className="flex gap-6">
					<button className="flex items-center gap-2 text-gray-500 text-[15px] font-medium bg-transparent">
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
						</span>
						Photo
					</button>
					<button className="flex items-center gap-2 text-gray-500 text-[15px] font-medium bg-transparent">
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
						</span>
						Video
					</button>
					<button className="flex items-center gap-2 text-gray-500 text-[15px] font-medium bg-transparent">
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
						</span>
						Event
					</button>
					<button className="flex items-center gap-2 text-gray-500 text-[15px] font-medium bg-transparent">
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
						</span>
						Article
					</button>
				</div>
				<button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
					<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
					Post
				</button>
			</div>
		</div>
	);
}

export default CreatePost;
