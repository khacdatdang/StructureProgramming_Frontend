import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import swal from 'sweetalert';

function ViewUser() {
   
    const [loading, setLoading] = useState(true)
    const [userList, setUserList] = useState([])
    const [userItem, setUserItem] = useState({})
    const [searchInput, setsearchInput] = useState({});
    const [statusInput, setstatusInput] = useState("");
    useEffect(() => {
        axios.get(`api/user`).then(res => {
            if (res.status === 200){
                console.log(res);
                setLoading(false)
                setUserList(res.data.data)
            }
        })
     }, [])

     const blockUser = (e,id) => {
         e.preventDefault()
         if (window.confirm("Are you sure to block this user")){
            axios.get(`api/user/${id}/block`).then(res => {
                alert("Block user success")
                window.location.reload()
            }).catch(err => {
                alert("Fail!!!")
            })
         }  
     }
     const activateUser = (e,id) => {
        e.preventDefault()
        if (window.confirm("Are you sure to activate this user")){
           axios.get(`api/user/${id}/active`).then(res => {
               alert("Activate user success")
               window.location.reload()
           }).catch(err => {
               alert("Fail!!!")
           })
        }  
    }

    const deleteUser = (e,id) => {
        e.preventDefault()
        if (window.confirm("Are you sure to delete this user")){
           axios.delete(`api/user/${id}`).then(res => {
               alert("Delete user success")
               window.location.reload()
           }).catch(err => {
               alert("Fail!!!")
           })
        }  
    }

    const handleSearchInput = e => {
        e.persist()
        setsearchInput({...searchInput,[e.target.name] : e.target.value})
        console.log(searchInput);
    }

    const handleStatusInput = e => {
        e.persist()
        setstatusInput({...statusInput,[e.target.name] : e.target.value})
        console.log(statusInput);
    }

    const searchSubmit = e => {
        e.preventDefault()
        const keyword = searchInput;
        if (keyword == ""){
            axios.get(`api/user`).then(res => {
                if (res.status === 200){
                    console.log(res);
                    setLoading(false)
                    setUserList(res.data.data)
                }
            })
        }
        else {
            axios.post(`/api/user/search`,searchInput).then(res => {
                // console.log(res.data.jobs)
                if (res.data.data.length)
                    setUserList(res.data.data)
                else 
                    swal("Error", "Cannot find", "error")
                setLoading(false)  
            })
        }
        
    }

    const filterSubmit = e => {
        e.preventDefault()
        const type = statusInput.status
        if (type){
            axios.get(`/api/users/${type}`).then(res => {
                setUserList(res.data.data)
                setLoading(false) 
            })
        } else {
            axios.get(`api/user`).then(res => {
                if (res.status === 200){
                    console.log(res);
                    setLoading(false)
                    setUserList(res.data.data)
                }
            })
        }
       
    }
  return (
      <>
        <h2>User List</h2>
        <form  onSubmit={searchSubmit}>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="">Search</span>
                </div>
                <input type="text" class="form-control" placeholder='name' name = 'name' onChange = {handleSearchInput}/>
                <input type="text" class="form-control" placeholder='phone'name = 'phone' onChange = {handleSearchInput}/>
                <button class="btn btn-outline-success" type="submit">Search</button>
            </div>
        </form>

        <form onSubmit={filterSubmit}>
            <select name = "status"class="form-select" aria-label="Default select example" onChange={handleStatusInput}>
            <option selected>Select type </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
            <option value = "">None</option>
            </select>
            <button class="btn btn-outline-success" type="submit">Filter</button>

        </form>
        
        
        {
            loading ? 
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            :
            <table class="table">
            <thead>
                <tr>
                <th scope="col">ID</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                {
                    userList.sort((a,b) => a.id > b.id ? 1 : -1).map((item) => {
                        return (
                            <tr>
                            <th scope="row">{item.id}</th>
                            <td>{item.phone}</td>
                            <td>{item.role}</td>
                            <td>{item.status}</td>
                            {/* <!-- Button trigger modal --> */}
                            <td>
                                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#userModal" onClick = {() => {setUserItem(item)}}>
                                View
                                </button>
                            </td>
                          

                            <td>
                            {item.status == "blocked" ?
                            <button type="button" className='btn btn-primary' onClick = {(e) => {activateUser(e,item.id)}} >Unblock</button> :
                            <button type="button" className='btn btn-warning' onClick = {(e) => {blockUser(e,item.id)}}>Block</button>
                            }
                            </td>

                            <td>
                            
                            <button type="button" className='btn btn-danger' onClick = {(e) => {deleteUser(e,item.id)}} >Delete </button>
                            
                            </td>
                            
                            
                            </tr>
                        )
                    })
                }
               
            </tbody>
            </table>
        }
        

        {/* <!-- Modal --> */}
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">User Info</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Phone : {userItem.phone}
                <br/>
                Email : {userItem.email}
                <br/>
                {
                    userItem.status != "inactive"  && 
                    <>
                        Name : {userItem.name}
                        <br/>
                        Address : {userItem.address}
                        <br/>
                        Birthday : {userItem.birthday}
                        <br/>
                        Gender : {userItem.gender}
                    </>
                    
                }
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                {/* <button type="button" class="btn btn-primary">Save changes</button> */}
            </div>
            </div>
        </div>
        </div>
      </>
  )
}

export default ViewUser;
