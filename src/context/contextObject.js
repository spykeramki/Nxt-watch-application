import React from 'react'

const ThemeAndSavedVideosContext = React.createContext({
  isDarkTheme: false,
  savedVideosList: [],
  selectedOption: '',
  likedVideoIdStatusList: [],
  changeTheme: () => {},
  addSavedVideos: () => {},
  removeSavedVideos: () => {},
  changeOption: () => {},
  changeLikeStatus: () => {},
})

export default ThemeAndSavedVideosContext
