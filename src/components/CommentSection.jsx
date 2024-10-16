import React, { useState, useEffect } from 'react';
import { FaPaperPlane } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const CommentSection = ({ postId, userId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost/discuss/api.php?action=getComments&post_id=${postId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            console.log('Response:', text); 

            if (!text) {
                throw new Error("Received empty response from server");
            }

            const data = JSON.parse(text);

            const sortedComments = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setComments(sortedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost/discuss/api.php?action=addComment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ user_id: userId, post_id: postId, comment: newComment }),
            });

            const text = await response.text();
            console.log('Response from addComment:', text); 

            const data = JSON.parse(text);
            
            if (data.success) {
                setNewComment('');
                fetchComments(); 
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const formatDate = (createdAt) => {
        const postDate = new Date(createdAt);
        const now = new Date();
    
        const diffInMilliseconds = now - postDate;
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);
    
        if (diffInYears > 0) {
            return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
        } else if (diffInMonths > 0) {
            return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
        } else if (diffInWeeks > 0) {
            return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
        } else if (diffInDays > 0) {
            return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
        } else if (diffInHours > 0) {
            return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
        } else if (diffInMinutes > 0) {
            return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
        } else {
            return 'just now';
        }
    };
    

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div className='flex flex-col items-center'>
            {/* <h5 className='text-lg mb-4 w-full'>Comments:</h5> */}
            <ul className='w-[880px] text-base flex flex-col items-center list-disc'>
                {comments.map(comment => (
                    <li className='mb-3' key={comment.id}>
                        <p className='w-[880px] '> 
                        <span className='text-sm'>Commented by: 
                        <Link to={`/user/${comment.username}/posts`} className='text-base hover:underline ml-1'>
                                        {comment.username}
                                    </Link>
                        </span>
                        <span className='text-sm text-gray-400 ml-2'> {formatDate(comment.created_at)}</span>
                        </p>
                        <p className='ml-2'>{comment.comment}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    required
                    className='bg-[#2e2e2e] p-4 border-[#868686] border-b-2 focus:border-[#ffe01b]
                        transition-color duration-300 w-[880px]'
                />
                <div className='flex justify-end'>
                    <button className='text-base font-bold pl-10 pr-10' type="submit"><FaPaperPlane />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentSection;
