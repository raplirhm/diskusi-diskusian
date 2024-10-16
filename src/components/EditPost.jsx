import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = ({ userId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { postId } = useParams();
    const navigate = useNavigate();

    const fetchPost = async () => {
        const response = await fetch(`http://localhost/api.php?action=getPost&id=${postId}`);
        const data = await response.json();
        if (data) {
            setTitle(data.title);
            setContent(data.content);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost/discuss/api.php?action=updatePost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: postId, user_id: userId, title, content }),
        });
        const data = await response.json();
        if (data.success) {
            navigate('/profile'); // Navigate back to profile
        } else {
            alert(data.error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div>
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                />
                <button type="submit">Update Post</button>
            </form>
        </div>
    );
};

export default EditPost;
