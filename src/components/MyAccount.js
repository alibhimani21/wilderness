import React, { useEffect, useContext, useState } from 'react'
import Axios from 'axios'
import { UserContext } from './Context'
import { Link } from 'react-router-dom'
import { ReviewList } from './ReviewList'
import { SiteList } from './SiteList'

export const MyAccount = () => {

  const { currentUser, setListDisplay } = useContext(UserContext)
  const [userDetails, setUserDetails] = useState()

  useEffect(() => {
    Axios.get(`/api/users/${currentUser.id}`)
      .then(response => {
        setUserDetails(response.data)
        setListDisplay(response.data)
      })
  }, [])

  if (!userDetails) return <h1>Loading...</h1>
  
  return (
    <section className="my-account">
      <h1>My Account</h1>
      <h2>{userDetails.firstName} {userDetails.lastName}</h2>
      <img src={userDetails.avatar} alt="user avatar"/>
      <Link to='account/settings'><p>Change avatar</p></Link>
      <h3>My bio:</h3>
      {userDetails.bio ?
        <p>{userDetails.bio}</p> :
        <p>No bio yet, would you <Link to='/account/settings'>like to add one</Link>?</p>
      }

      {/* TABS */}
      <h3>Places I want to go:</h3>
      {(userDetails.recAreaWishList.length || userDetails.campgroundWishList.length) ?
        <div className="wish-list">
          <div className="rec-area-wish-list">
            {userDetails.recAreaWishList.map((recArea, i) => <SiteList key={i} site={recArea} />)}
          </div>
          <div className="campground-wish-list">
            {userDetails.campgroundWishList.map((campground, i) => <SiteList key={i} site={campground} />)}
          </div>
        </div> :
        <p>You haven&apos;t put any places on your wish list yet. Just click on the heart to add a recreational area or campground to your list.</p>
      }
      <h3>Places I&apos;ve been:</h3>
      {(userDetails.recAreasVisited.length || userDetails.campgroundsVisited.length) ?
        <div className="visited">
          <div className="rec-areas-visited">
            {userDetails.recAreasVisited.map((recArea, i) => <SiteList key={i} site={recArea} />)}
          </div>
          <div className="campgrounds-visited">
            {userDetails.campgroundsVisited.map((campground, i) => <SiteList key={i} site={campground} />)}
          </div>
        </div> :
        <p>You haven&apos;t marked any places as visited yet. Just click on the tick to add a recreational area or campground to your list of visited places.</p>
      }

      <h3>My reviews:</h3>
      {(userDetails.recAreaReviews.length || userDetails.campgroundReviews.length) ?
        <div className="my-reviews">
          <div className="rec-area-reviews">
            {userDetails.recAreaReviews.map((review, i) => <ReviewList key ={i} review={review} displayName={false} />)}
          </div>
          <div className="campground-reviews">
            {userDetails.campgroundReviews.map((review, i) => <ReviewList key ={i} review={review} displayName={false} />)}
          </div>
        </div> :
        <p>You haven&apos;t left any reviews yet. Why not add one for somewhere you&apos;ve been?</p>
      }



    </section>
  )
}