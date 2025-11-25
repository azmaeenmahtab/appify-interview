import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Avatar from './Avatar';

interface LikeUser {
  id: number;
  user_id: number;
  created_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
}

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fetchLikes: (limit: number, offset: number) => Promise<{
    likes: LikeUser[];
    total: number;
  }>;
}

const LikesModal: React.FC<LikesModalProps> = ({ isOpen, onClose, title, fetchLikes }) => {
  const [likes, setLikes] = useState<LikeUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  useEffect(() => {
    if (isOpen) {
      loadLikes(true);
    } else {
      // Reset state when modal closes
      setLikes([]);
      setOffset(0);
      setHasMore(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadLikes = async (reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const result = await fetchLikes(limit, currentOffset);
      
      if (reset) {
        setLikes(result.likes);
        setOffset(result.likes.length);
      } else {
        setLikes(prev => [...prev, ...result.likes]);
        setOffset(prev => prev + result.likes.length);
      }
      
      setTotal(result.total);
      setHasMore(result.likes.length === limit);
    } catch (error) {
      console.error('Failed to load likes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && likes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : likes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No likes yet
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {likes.map((like) => (
                  <div key={like.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Avatar firstName={like.user_first_name} lastName={like.user_last_name} userId={like.user_id} size="md" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {like.user_first_name} {like.user_last_name}
                      </div>
                      <div className="text-sm text-gray-500">{like.user_email}</div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={() => loadLikes(false)}
                  disabled={loading}
                  className="w-full mt-4 py-2 text-blue-500 hover:text-blue-600 text-sm font-medium disabled:text-gray-400"
                >
                  {loading ? 'Loading...' : 'Load more'}
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
          {total} {total === 1 ? 'person' : 'people'} liked this
        </div>
      </div>
    </div>
  );
};

export default LikesModal;