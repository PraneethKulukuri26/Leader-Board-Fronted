import './styleS/board.css';
import Header from './Header';
import React, { useState,useEffect } from 'react';
const url='http://180.188.227.250:7070';

function Board(){  
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [users,setUsers]=useState([]);
    const [userId,setNewUserId]=useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [HistoryList,setHistoryList]=useState([]);
    

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${url}/api/user/loadUsers/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUserClick = () => {
        setIsFormOpen(true);
    };

    const handleAddBtn=async (e)=>{
        e.preventDefault();

        if(newUserName.trim()){
            const response = await fetch(`${url}/api/user/addUser/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name:newUserName})
            });
            setNewUserName('');
            setIsFormOpen(false);

            fetchUsers();
        }
    };

    const reward=async ()=>{
        const response = await fetch(`${url}/api/user/cliamPoints?uuid=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(response.ok){
            const data=await response.json();
            if(data.success){
                alert(`Points claimed successfully! You received ${data.awardedPoints} points.`);
                fetchUsers();
            }else {
                alert("Failed to claim points. Please try again.");
            }
        }else {
            alert("Failed to claim points. Please try again.");
        }
    };

    const handleUserClick = async (uuid) => {
        console.log("clicked");
        const user = users.find((user) => user.uuid === uuid);
        if (user) {
            setSelectedUser(user);
            setIsDialogOpen(true);

            const response = await fetch(`${url}/api/user/historyPoints?uuid=${uuid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if(response.ok){
                const data=await response.json();
                if(data.success){
                    console.log(data.history);
                    setHistoryList(data.history);
                }
            }
        }
    };

    const searchBox=async (uuid)=>{

        const response = await fetch(`${url}/api/user/loadUserInfo?uuid=${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(response.ok){
            const data=await response.json();
            if(data.success){
                setSelectedUser(data.info);
                setIsDialogOpen(true);

                const response = await fetch(`${url}/api/user/historyPoints?uuid=${uuid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        
                if(response.ok){
                    const data=await response.json();
                    if(data.success){
                        console.log(data.history);
                        setHistoryList(data.history);
                    }
                }
            }else{
                alert(data.message);
            }
        }
    };

    return (
        <>
            <div className='boardLayout'>
                <Header onAddUserClick={handleAddUserClick} searchBox={searchBox}/>
                <div className='append1'>
                    <p>S.I</p>
                    <p style={{marginRight:'30px'}}>UUID</p>
                    <p>Name</p>

                </div>

                <div className='append2'>
                    {users.map((user, index) => (
                        <div className='appen2Item' key={user.uuid} onClick={() => handleUserClick(user.uuid)}>
                            <p>{index + 1}</p>
                            <p>{user.uuid}</p>
                            <p>{user.name}</p>

                            <p className='pointsText'>{user.points}</p>
                        </div>
                    ))}
                </div>

                {isFormOpen && (
                    <div className="formOverlay">
                        <form className="userForm" onSubmit={handleAddBtn}>
                            <label>
                                Enter Name:
                                <input
                                    type="text"
                                    onChange={(e) =>setNewUserName(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Add</button>
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="cancelBtn"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {isDialogOpen && selectedUser && (
                    <div className="dialogOverlay">
                        <div className="dialogBox">
                            <h2>User Details</h2>
                            
                            <div className='appen2Item' >
                                <p>{1 + 1}</p>
                                <p>{selectedUser.uuid}</p>
                                <p>{selectedUser.name}</p>

                                <p className='pointsText'>{selectedUser.points}</p>
                            </div>

                            <p style={{fontSize:'15px',textAlign:'center',margin:'auto',marginTop:'20px'}}>Rewards History</p>

                            <div className='append4'>
                                {
                                    HistoryList.map((item, index) => (
                                        <div className='appen2Item' key={index}>
                                            <p>{index + 1}</p>
                                            <p>{new Date(item.transaction_date).toLocaleString()}</p>
                                            <p className='pointsText'>{item.points}</p>
                                        </div>
                                    ))
                                }
                            </div>

                            <button onClick={() =>{ setHistoryList([]);setIsDialogOpen(false);}}>Close</button>

                        </div>
                    </div>
                )}

                <div className='bottomNav'>
                    <div style={{display:'flex',gap:'10px'}}>
                        <input type='number' onChange={(e)=>setNewUserId(e.target.value)} placeholder='Enter user ID'/>
                        <button onClick={reward}>Claim</button>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Board;