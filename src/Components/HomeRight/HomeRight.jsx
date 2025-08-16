"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import PopularUser from "./PopularUser"
import { Fade } from "@mui/material"
import SearchUser2 from "../SearchUser2/SearchUser2"
import { useDispatch, useSelector } from "react-redux"
import { getUsers, getFollowing } from "../../Redux/Profile/profileaction"
import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material"

const HomeRight = React.memo(() => {
  const dispatch = useDispatch()
  const [showAll, setShowAll] = useState(false)
  const { profile, auth } = useSelector((store) => store)

  const usersToShow = useMemo(() => {
    if (!profile.users) return []
    return showAll ? profile.users : profile.users.slice(0, 5)
  }, [profile.users, showAll])

  useEffect(() => {
    // Only fetch users if we don't have them already
    if (!profile.users?.length) {
      dispatch(getUsers())
    }
  }, [dispatch, profile.users?.length])

  useEffect(() => {
    // Only fetch following if we have a user ID and don't have following data
    if (auth?.user?.id && !profile.following?.length) {
      dispatch(getFollowing(auth.user.id))
    }
  }, [dispatch, auth?.user?.id, profile.following?.length])

  const handleViewAll = useCallback(() => {
    setShowAll((prev) => !prev)
  }, [])

  const isLoading = profile.loading
  const hasUsers = profile.users?.length > 0
  const showViewAllButton = profile.users?.length > 5

  return (
    <div className="w-80 space-y-6">
      <SearchUser2 />

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Suggestions For You</h3>

            {showViewAllButton && (
              <button
                onClick={handleViewAll}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
              >
                {showAll ? (
                  <>
                    <VisibilityOff className="w-4 h-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <Visibility className="w-4 h-4" />
                    <span>View All</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {isLoading ? (
            // Loading skeletons
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : hasUsers ? (
            <Fade in={true} timeout={500}>
              <div>
                {usersToShow.map((item) => (
                  <PopularUser key={item.id} item={item} />
                ))}
              </div>
            </Fade>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <PersonAdd className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-2">No suggestions yet</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Check back later for new people to connect with
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

HomeRight.displayName = "HomeRight"

export default HomeRight
