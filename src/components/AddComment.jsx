import React, { useState } from 'react';

const AddComment = ({ userId, postId, onCommentAdded }) => {
    const [comment, setComment] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost/discuss/api.php?action=addComment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                post_id: postId,
                comment, 
            }),
        });
        const data = await response.json();
        if (data.success) {
            setComment(''); 
            onCommentAdded(); 
        } else {
            alert(data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                required
            />
            <button type="submit">Submit Comment</button>
        </form>
    );
};

export default AddComment;
