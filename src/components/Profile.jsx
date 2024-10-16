import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import CommentSection from './CommentSection';
import Modal from './Modal';
import { MdEdit, MdDelete } from "react-icons/md";

const Profile = ({ user, onLogout }) => {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [showComments, setShowComments] = useState({});
    const [editingPost, setEditingPost] = useState(null); // New state for editing posts
    const [editContent, setEditContent] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingPost, setDeletingPost] = useState(null);
    
    const fetchUserPosts = async () => {
        const response = await fetch(`http://localhost/discuss/api.php?action=getUserPosts&user_id=${user.id}`);
        const data = await response.json();
        const sortedPosts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(data);
    };

    const toggleComments = (postId) => {
        setShowComments(prevState => ({
            ...prevState,
            [postId]: !prevState[postId] // Toggle visibility for the selected post's comments
        }));
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setEditContent(post.content);
        setIsEditModalOpen(true); // Open edit modal
    };

    const handleDelete = (post) => {
        setDeletingPost(post);
        setIsDeleteModalOpen(true); // Open delete modal
    };

    const confirmDelete = async (postId) => {
        const response = await fetch(`http://localhost/discuss/api.php?action=deletePost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId })
        });
        if (response.ok) {
            fetchUserPosts(); // Refresh posts after delete
            setIsDeleteModalOpen(false); // Close delete modal
        }
    };

    const saveEdit = async (postId) => {
        const response = await fetch(`http://localhost/discuss/api.php?action=editPost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, content: editContent })
        });
        if (response.ok) {
            fetchUserPosts(); // Refresh posts after edit
            setIsEditModalOpen(false); // Close edit modal
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
        fetchUserPosts();
    }, [user.id]);

    return (
        <div key={user}>
            {/* <div className='bg-[#2e2e2e] p-4 h-[60px] shadow-lg mb-10 flex items-center'>
                <h2 className='font-semibold'>Welcome, {user.username}</h2>
                <div className='self-end ml-auto'>
                    <Link to="/">
                        <button className='mr-3 font-bold pt-[1px] pb-[1px] pr-[19px] pl-[19px] border-[1px] border-white bg-[#2e2e2e] text-white'>Home</button>
                    </Link>
                    <button
                        onClick={onLogout}
                        className='font-bold pt-[2px] pb-[2px] pr-[20px] pl-[20px]'>
                        Logout
                    </button>
                </div>
            </div> */}
            <div className='flex flex-col items-center'>
                <h1 className='text-7xl mt-10'>Your Posts</h1>
                <button onClick={() => setIsModalOpen(true)} className='font-bold text-base'>Create Post</button>
                <h3 className='text-4xl mt-10'>(?)</h3>

                {/* Modal for Creating New Post */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <CreatePost userId={user.id} onPostCreated={fetchUserPosts} />
                </Modal>

                {/* Modal for Editing Post */}
                {editingPost && (
                    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                        <div className='flex flex-col p-10 w-[1200px] min-h-[200px] bg-[#2e2e2e] rounded-3xl shadow-xl'>
                            <h2 className='text-2xl mb-4'>Edit Post</h2>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className='bg-[#2e2e2e] p-4 border-[#868686] border-b-2 focus:border-[#ffe01b]
                                transition-color duration-300 mb-4 w-full h-40'
                            />
                            <div className='self-end'>
                                <button onClick={() => saveEdit(editingPost.id)} className='mt-2 font-bold text-base'>Save</button>
                                <button onClick={() => setIsEditModalOpen(false)} className='ml-2 font-bold text-base'>Cancel</button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Modal for Deleting Post */}
                {deletingPost && (
                    <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                        <div className='flex flex-col p-10 bg-[#2e2e2e] rounded-xl shadow-xl'>
                            <h2 className='text-2xl mb-4 text-white'>Delete Post</h2>
                            <p className='text-lg mb-4'>Are you sure you want to delete this post?</p>
                            <div className='self-end'>
                                <button onClick={() => confirmDelete(deletingPost.id)} className='bg-[#ff1b1b] mt-2 font-bold text-base text-black'>Yes, Delete</button>
                                <button onClick={() => setIsDeleteModalOpen(false)} className='ml-2 font-bold text-base'>Cancel</button>
                            </div>
                        </div>
                    </Modal>
                )}

                <ul>
                    {posts.map(post => (
                        <li key={post.id} className='flex flex-col items-center p-10 w-[1000px] bg-[#2e2e2e] rounded-3xl shadow-xl mt-10'>
                            <p className='mb-4 w-full text-left'>
                                <span className='text-base'>Posted by: {post.username}</span>
                                <span className='text-sm text-gray-400 ml-2'> {formatDate(post.created_at)}</span>
                            </p>
                            <div className='w-[880px]'>
                                <h4 className='text-3xl mb-4'>{post.title}</h4>
                                <p className='text-base'>{post.content}</p>
                            </div>

                            <div className='flex w-full'>
                                <button
                                    onClick={() => toggleComments(post.id)}
                                    className='text-sm font-bold text-black self-start'>
                                    {showComments[post.id] ? 'Hide Comments' : 'Show Comments'}
                                </button>
                                {user.id === post.user_id && (
                                    <div className='flex ml-auto'>
                                        <button onClick={() => handleEdit(post)} className='text-xl font-bold text-black mr-3'>
                                            <MdEdit />
                                        </button>
                                        <button onClick={() => handleDelete(post)} className='text-xl font-bold text-black'>
                                            <MdDelete />
                                        </button>
                                    </div>
                                )}
                            </div>
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

export default Profile;
