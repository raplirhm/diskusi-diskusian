import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentSection from './CommentSection';

const UserPosts = () => {
    const { username } = useParams(); 
    const [posts, setPosts] = useState([]);
    const [showComments, setShowComments] = useState({});

    const fetchUserPosts = async () => {
        const response = await fetch(`http://localhost/discuss/api.php?action=getUserProfile&username=${username}`);
        const text = await response.text(); 
        console.log(text); 
        try {
            const data = JSON.parse(text); 
            setPosts(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };

    const toggleComments = (postId) => {
        setShowComments(prevState => ({
            ...prevState,
            [postId]: !prevState[postId] // Toggle visibility for the selected post's comments
        }));
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
        fetchUserPosts();
    }, [username]);

    return (
        <div className='flex flex-col items-center content'>

            <h1 className="text-7xl mt-10">Posts by {username}</h1>
            <h3 className='text-4xl mt-10'>(?)</h3>
            <ul>
                {posts.map(post => (
                    <li key={post.id} className='
                    flex flex-col items-center p-10 
                    w-[1000px] min-h-[200px]
                    bg-[#2e2e2e] rounded-3xl shadow-xl mt-10
                    '>
                        <p className='mb-4 w-full text-left'>
                            <span className='text-base'>Posted by: {post.username}
                            </span>
                            <span className='text-sm text-gray-400'> {formatDate(post.created_at)}</span>
                        </p>
                        <div className='w-[880px]'>
                            <h4 className='text-3xl mb-4'>{post.title}</h4>
                            <p className='text-base'>{post.content}</p>
                        </div>

                        {/* Toggle Comments Button */}
                        <button
                            onClick={() => toggleComments(post.id)}
                            className='text-sm font-bold text-blkack self-start'>
                            {showComments[post.id] ? 'Hide Comments' : 'Show Comments'}
                        </button>

                        {/* Conditionally render the CommentSection */}
                        {showComments[post.id] && (
                            <div className='w-full mt-4'>
                                <CommentSection postId={post.id} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserPosts;
