import './styleS/header.css';
import React, { useRef } from 'react';

function Header({ onAddUserClick ,searchBox}){
    const inputRef = useRef(null);
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchBox(event.target.value);

            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    return (
        <>
            <div className="header">
                <p>Leader Board</p>
                <input type='number' placeholder='Search User ID' ref={inputRef} onKeyDown={handleKeyDown}/>
                <button onClick={onAddUserClick}>Add User</button>
            </div>
        </>
    );
}

export default Header;