import React, { useEffect, useContext, useState } from 'react'
import Axios from 'axios'
import { UserContext } from './Context'
import { Link } from 'react-router-dom'
import { ReviewListItem } from './ReviewList'
import { SiteList } from './SiteList'
import { Settings } from './Settings'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

export const MyAccount = () => {

  const { currentUser, setListDisplayPreferences } = useContext(UserContext)
  const [userDetails, setUserDetails] = useState()
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState('')

  useEffect(() => {
    Axios.get(`/api/users/${currentUser.id}`)
      .then(response => {
        setUserDetails(response.data)
        setListDisplayPreferences(response.data)
      })
  }, [])

  function handleClick(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    Axios.put(`/api/users/${currentUser.id}`, { bio }, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setUserDetails({
          ...userDetails,
          bio: response.data.bio
        })
        setEditingBio(false)
      }
      )

      .catch(error => console.log(error))
  }

  if (!userDetails) return <h1>Loading...</h1>

  return (
    <section className="my-account">
      <h1>My Account</h1>
      <h2>{userDetails.firstName} {userDetails.lastName}</h2>
      <img src={userDetails.avatar} alt="user avatar" />
      <Link to='account/settings'><p>Change avatar</p></Link>
      <h3>My bio:</h3>
      {userDetails.bio ?
        <>
          <p>{userDetails.bio}</p>
          <span onClick={() => setEditingBio(true)}>Edit bio</span>
        </>
        :
        <p>No bio yet...<span onClick={() => setEditingBio(true)}>add one</span></p>
      }
      {editingBio && <form>
        <label htmlFor="edit-bio">Edit your bio here</label>
        <textarea id="edit-bio" name="bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
        <button onClick={handleClick}>Save</button>
      </form>}

      <Tabs>
        <TabList>
          <Tab>My Locations</Tab>
          <Tab>My Reviews</Tab>
          <Tab>My Settings</Tab>
        </TabList>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>My Wishlist</Tab>
              <Tab>Places I&apos;ve Visited</Tab>
            </TabList>
            <TabPanel>
              {currentUser.showWishList && <>
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
              </>}
            </TabPanel>
            <TabPanel>
              {currentUser.showVisited && <>
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
              </>}
            </TabPanel>
          </Tabs>
        </TabPanel>
        <TabPanel>
          <h3>My reviews:</h3>
          {(userDetails.recAreaReviews.length || userDetails.campgroundReviews.length) ?
            <div className="my-reviews">
              <div className="rec-area-reviews">
                {userDetails.recAreaReviews.map((review, i) => <ReviewListItem key={i} review={review} displayName={false} enableComments={false} displayAvatar={false} />)}
              </div>
              <div className="campground-reviews">
                {userDetails.campgroundReviews.map((review, i) => <ReviewListItem key={i} review={review} displayName={false} enableComments={false} displayAvatar={false} />)}
              </div>
            </div> :
            <p>You haven&apos;t left any reviews yet. Why not add one for somewhere you&apos;ve been?</p>
          }
        </TabPanel>
        <TabPanel>
          <Settings />
        </TabPanel>
      </Tabs>

    </section>
  )
}