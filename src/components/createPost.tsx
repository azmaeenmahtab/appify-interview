import React, { useState } from 'react';
import { postService } from '../services/postService';


interface CreatePostProps {
	profilePic: string;
	onPostCreated?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ profilePic, onPostCreated }) => {
	const [content, setContent] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isPublic, setIsPublic] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
			if (!allowedTypes.includes(file.type)) {
				setError('Only JPEG, PNG, GIF, and WebP images are allowed');
				return;
			}

			// Validate file size (5MB)
			if (file.size > 5 * 1024 * 1024) {
				setError('Image size must be less than 5MB');
				return;
			}

			setImage(file);
			setError('');
			
			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setImage(null);
		setImagePreview(null);
	};

	const handleSubmit = async () => {
		if (!content && !image) {
			setError('Post must contain text or an image');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await postService.createPost({
				content: content || undefined,
				image: image || undefined,
				isPublic,
			});

			// Reset form
			setContent('');
			setImage(null);
			setImagePreview(null);
			setIsPublic(true);

			// Notify parent to refresh posts
			if (onPostCreated) {
				onPostCreated();
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create post');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-xl p-4 shadow">
			{error && (
				<div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
					{error}
				</div>
			)}
			
			<div className="flex items-start mb-4">
				<img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover mr-3" />
                <div className='flex-1'>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Write something ..."
						className="w-full bg-transparent outline-none text-gray-700 text-[18px] resize-none"
						rows={3}
					/>
					
					{imagePreview && (
						<div className="relative mt-3 inline-block">
							<img src={imagePreview} alt="Preview" className="max-h-60 rounded-lg" />
							<button
								onClick={removeImage}
								className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
							>
								<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
									<path d="M18 6L6 18M6 6l12 12"/>
								</svg>
							</button>
						</div>
					)}
                </div>
			</div>

			<div className="flex items-center gap-2 mb-3">
				<label className="flex items-center gap-2 text-sm text-gray-600 font-medium cursor-pointer">
					<input
						type="checkbox"
						checked={isPublic}
						onChange={(e) => setIsPublic(e.target.checked)}
						className="accent-blue-600 text-gray-600"
					/>
					Public post
				</label>
			</div>

			<div className="bg-blue-50 rounded-lg flex items-center justify-between px-4 py-3">
				<div className="flex gap-6">
					<label className="flex items-center gap-2 text-gray-500 text-[15px] font-medium bg-transparent cursor-pointer hover:text-blue-600">
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
						</span>
						Photo
					</label>
					<button className="flex items-center gap-2 text-gray-400 text-[15px] font-medium bg-transparent cursor-not-allowed" disabled>
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
						</span>
						Video
					</button>
					<button className="flex items-center gap-2 text-gray-400 text-[15px] font-medium bg-transparent cursor-not-allowed" disabled>
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
						</span>
						Event
					</button>
					<button className="flex items-center gap-2 text-gray-400 text-[15px] font-medium bg-transparent cursor-not-allowed" disabled>
						<span>
							<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
						</span>
						Article
					</button>
				</div>
				<button 
					onClick={handleSubmit}
					disabled={loading || (!content && !image)}
					className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
				>
					<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
					{loading ? 'Posting...' : 'Post'}
				</button>
			</div>
		</div>
	);
}

export default CreatePost;
