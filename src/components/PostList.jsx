import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import CommentSection from './CommentSection';
import Modal from './Modal';
import { Link } from 'react-router-dom';

const PostList = ({ user, onLogout }) => {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [showComments, setShowComments] = useState({}); // State to manage comment visibility per post

    const fetchPosts = async () => {
        const response = await fetch('http://localhost/discuss/api.php?action=getPosts');
        const data = await response.json();
        const sortedPosts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedPosts);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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

    return (
        <div key={user} className=''>
            <div className='bg-[#2e2e2e] p-4 h-[60px] shadow-lg mb-10 flex items-center fixed top-0 left-0 w-full z-50'>
                <h2 className='font-semibold'>Welcome, {user.username}</h2>
                <div className='self-end ml-auto '>
                    <Link to="/profile">
                        <button className='mr-3 font-bold pt-[1px] pb-[1px] pr-[19px] pl-[19px] border-[1px] border-white bg-[#2e2e2e] text-white'>Profile</button>
                    </Link>
                    <button onClick={onLogout} className='font-bold pt-[2px] pb-[2px] pr-[20px] pl-[20px]'>Logout</button>
                </div>
            </div>
            <div className='flex flex-col items-center content mt-20'>
                <h1 className='text-7xl'>Share Your Thoughts</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='font-bold text-base'>
                    Create Post
                </button>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <CreatePost userId={user.id} onPostCreated={() => {
                        fetchPosts();
                        setIsModalOpen(false);
                    }} />
                </Modal>

                <h3 className='text-4xl mt-10'>(?)</h3>
                <ul>
                    {posts.map(post => (
                        <li key={post.id}
                            className='
                            flex flex-col items-center p-10 
                            w-[1000px] min-h-[200px]
                            bg-[#2e2e2e] rounded-3xl shadow-xl mt-10
                            '>
                            <p className='mb-4 w-full text-left'>
                                <span className='text-base'>Posted by:
                                    <Link to={`/user/${post.username}/posts`} className='text-base hover:underline ml-1'>
                                        {post.username}
                                    </Link>
                                </span>
                                <span className='text-sm text-gray-400 ml-2'> {formatDate(post.created_at)}</span>
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
                                    <CommentSection postId={post.id} userId={user.id} />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PostList;
