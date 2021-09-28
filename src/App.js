import {Route, Switch, Redirect} from 'react-router-dom'
import {Component} from 'react'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'
import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import TrendingRoute from './components/TrendingRoute'
import GamingRoute from './components/GamingRoute'
import SavedVideosRoute from './components/SavedVideosRoute'
import VideoDetailsRoute from './components/VideoDetailsRoute'
import NotFoundRoute from './components/NotFoundRoute'
import ThemeAndSavedVideosContext from './context/contextObject'

class App extends Component {
  state = {
    isDarkTheme: false,
    savedVideosList: [],
    selectedOption: 'HOME',
    likedVideoIdStatusList: [],
  }

  changeTheme = () => {
    this.setState(prevState => ({isDarkTheme: !prevState.isDarkTheme}))
  }

  removeSavedVideos = videoDetails => {
    console.log(videoDetails)
    const {id} = videoDetails
    const {savedVideosList} = this.state
    const updatedSavedVideosList = savedVideosList.filter(
      eachVideo => eachVideo.id !== id,
    )
    this.setState({savedVideosList: updatedSavedVideosList})
  }

  addSavedVideos = videoDetails => {
    this.setState(prevState => ({
      savedVideosList: [...prevState.savedVideosList, videoDetails],
    }))
  }

  changeOption = option => {
    this.setState({selectedOption: option})
  }

  changeLikeStatus = (id, status) => {
    const {likedVideoIdStatusList} = this.state
    const videoIdObject = likedVideoIdStatusList.find(
      eachItem => eachItem.id === id,
    )
    if (videoIdObject === undefined) {
      this.setState(prevState => ({
        likedVideoIdStatusList: [
          ...prevState.likedVideoIdStatusList,
          {id, status},
        ],
      }))
    } else {
      this.setState(prevState => ({
        likedVideoIdStatusList: prevState.likedVideoIdStatusList.map(
          eachObj => {
            if (eachObj.id === id) {
              return {...eachObj, status}
            }
            return eachObj
          },
        ),
      }))
    }
    console.log(id, status)
  }

  render() {
    const {
      isDarkTheme,
      savedVideosList,
      selectedOption,
      likedVideoIdStatusList,
    } = this.state
    return (
      <ThemeAndSavedVideosContext.Provider
        value={{
          isDarkTheme,
          savedVideosList,
          selectedOption,
          likedVideoIdStatusList,
          changeTheme: this.changeTheme,
          addSavedVideos: this.addSavedVideos,
          removeSavedVideos: this.removeSavedVideos,
          changeOption: this.changeOption,
          changeLikeStatus: this.changeLikeStatus,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginRoute} />
          <ProtectedRoute exact path="/" component={HomeRoute} />
          <ProtectedRoute exact path="/trending" component={TrendingRoute} />
          <ProtectedRoute exact path="/gaming" component={GamingRoute} />
          <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoDetailsRoute}
          />
          <ProtectedRoute
            exact
            path="/saved-videos"
            component={SavedVideosRoute}
          />
          <Route exact path="/not-found" component={NotFoundRoute} />
          <Redirect to="not-found" />
        </Switch>
      </ThemeAndSavedVideosContext.Provider>
    )
  }
}

export default App
