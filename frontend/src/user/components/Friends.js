import React, { useEffect, useState, useContext } from 'react'

import FriendList from './FriendList'
import Card from '../../shared/components/UIElements/Card'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import Pagination from '../../shared/components/UIElements/Pagination'
import { NotifContext } from '../../shared/context/notif-context'

import './Friends.css'

const Friends = () => {
  const [loadedFriends, setLoadedFriends] = useState([])
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const { notifFollower } = useContext(NotifContext)
  const [deleteButtonCount, setDeleteButtonCount] = useState(0)

  const [postsPerPage] = useState(6)
  const [currentPage, setCurrentPage] = useState(1)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/friends/${auth.userId}`
        )
        setLoadedFriends(responseData.friendsList)
      } catch (err) {}
    }

    fetchFriends()
  }, [sendRequest, auth.userId, deleteButtonCount, notifFollower])

  const deleteFriend = async (userId, friendId) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/friends/delete`,
        'DELETE',
        JSON.stringify({
          userId: userId,
          friendId: friendId,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      )
    } catch (err) {}
    setDeleteButtonCount((currentCount) => {
      return currentCount + 1
    })
  }

  const friendsPerPage = loadedFriends.slice(indexOfFirstPost, indexOfLastPost)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loadedFriends.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Friend Found</h2>
        </Card>
      </div>
    )
  }

  return (
    <div className="center friends">
      <div className="friends-list">
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner />}
        {!isLoading && loadedFriends && (
          <FriendList deleteFriend={deleteFriend} items={friendsPerPage} />
        )}
      </div>

      {!isLoading && loadedFriends && (
        <div className="center">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={loadedFriends.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  )
}

export default Friends
