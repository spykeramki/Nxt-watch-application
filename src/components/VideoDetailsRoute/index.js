import {Component} from 'react'
import {formatDistanceToNow} from 'date-fns'
import Cookies from 'js-cookie'
import {BiLike, BiDislike} from 'react-icons/bi'
import {MdPlaylistAdd} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SideBarMenu from '../SideBarMenu'
import ThemeAndSavedVideosContext from '../../context/contextObject'

import {
  VideoDetailedBgContainer,
  ReactPlayerElement,
  VideoPlayerContainer,
  LikeAndSaveContainer,
  VideoTitle,
  VideoDetailsViewsAndTime,
  ButtonsContainer,
  HorizontalLine,
  UserActionButton,
  LikeButton,
  DisLikeButton,
  UserActionIconContainer,
  ChannelContainer,
  ChannelImage,
  ChannelName,
  SubscribersCount,
  Description,
  LoaderBgContainer,
  FailureViewImage,
  ErrorText,
  ErrorDescription,
  RetryButton,
} from './styledComponents'

const status = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class VideoDetailsRoute extends Component {
  state = {
    videoDetails: {},
    loadingStatus: status.loading,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  getVideoDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/videos/${id}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        channel: {
          name: data.video_details.channel.name,
          profileImageUrl: data.video_details.channel.profile_image_url,
          subscriberCount: data.video_details.channel.subscriber_count,
        },
        id: data.video_details.id,
        publishedAt: data.video_details.published_at,
        thumbnailUrl: data.video_details.thumbnail_url,
        title: data.video_details.title,
        viewCount: data.video_details.view_count,
        videoUrl: data.video_details.video_url,
        description: data.video_details.description,
      }

      this.setState({videoDetails: updatedData, loadingStatus: status.success})
    } else {
      this.setState({loadingStatus: status.failure})
    }
  }

  changeSavedStatus = () => {
    this.setState(prevState => ({
      videoDetails: {
        ...prevState.videoDetails,
        isSaved: !prevState.videoDetails.isSaved,
      },
    }))
  }

  render() {
    const {loadingStatus, videoDetails} = this.state
    const {
      id,
      videoUrl,
      title,
      viewCount,
      publishedAt,
      channel,
      description,
    } = videoDetails
    return (
      <ThemeAndSavedVideosContext.Consumer>
        {value => {
          const {
            isDarkTheme,
            savedVideosList,
            likedVideoIdStatusList,
            addSavedVideos,
            removeSavedVideos,
            changeLikeStatus,
          } = value

          const isVideoSaved = () => {
            const videoSaved = savedVideosList.find(
              eachVideo => eachVideo.id === id,
            )
            if (videoSaved === undefined) {
              return false
            }
            return true
          }

          const getVideoLikeStatus = () => {
            const videoObject = likedVideoIdStatusList.find(
              eachItem => eachItem.id === id,
            )
            if (videoObject === undefined) {
              return 'NONE'
            }
            return videoObject.status
          }

          const isSaved = isVideoSaved()
          const likeStatus = getVideoLikeStatus()

          const onClickLike = () => {
            if (likeStatus === 'LIKE') {
              changeLikeStatus(id, 'NONE')
            } else {
              changeLikeStatus(id, 'LIKE')
            }
          }

          const onClickDislike = () => {
            if (likeStatus === 'DISLIKE') {
              changeLikeStatus(id, 'NONE')
            } else {
              changeLikeStatus(id, 'DISLIKE')
            }
          }

          const onClickSaveButton = () => {
            if (isSaved === false) {
              addSavedVideos(videoDetails)
            } else {
              removeSavedVideos(videoDetails)
            }
          }

          const getTimeAgo = () => {
            const formattedDate = formatDistanceToNow(new Date(publishedAt))
            return formattedDate
          }

          const renderVideoPlayer = () => (
            <ReactPlayerElement controls url={videoUrl} width="100%" />
          )
          const renderLoader = () => (
            <LoaderBgContainer data-testid="loader">
              <Loader
                type="ThreeDots"
                color={isDarkTheme ? '#ffffff' : '#3b82f6'}
                height="50"
                width="50"
              />
            </LoaderBgContainer>
          )
          const renderVideoDetails = () => (
            <>
              <VideoTitle isDarkTheme={isDarkTheme}>{title}</VideoTitle>
              <LikeAndSaveContainer>
                <VideoDetailsViewsAndTime>
                  {viewCount} views . {getTimeAgo()} ago
                </VideoDetailsViewsAndTime>
                <ButtonsContainer>
                  <LikeButton
                    type="button"
                    onClick={onClickLike}
                    likeStatus={likeStatus}
                  >
                    <UserActionIconContainer>
                      <BiLike />
                    </UserActionIconContainer>
                    Like
                  </LikeButton>
                  <DisLikeButton
                    type="button"
                    onClick={onClickDislike}
                    likeStatus={likeStatus}
                  >
                    <UserActionIconContainer>
                      <BiDislike />
                    </UserActionIconContainer>
                    Dislike
                  </DisLikeButton>
                  <UserActionButton
                    type="button"
                    onClick={onClickSaveButton}
                    isSaved={isSaved}
                  >
                    <UserActionIconContainer>
                      <MdPlaylistAdd />
                    </UserActionIconContainer>
                    {isSaved ? 'Saved' : 'Save'}
                  </UserActionButton>
                </ButtonsContainer>
              </LikeAndSaveContainer>
            </>
          )

          const renderChannelDetails = () => (
            <ChannelContainer>
              <ChannelImage src={channel.profileImageUrl} alt="channel logo" />
              <div>
                <ChannelName isDarkTheme={isDarkTheme}>
                  {channel.name}
                </ChannelName>
                <SubscribersCount>
                  {channel.subscriberCount} subscribers
                </SubscribersCount>
                <Description isDarkTheme={isDarkTheme}>
                  {description}
                </Description>
              </div>
            </ChannelContainer>
          )
          const onClickRetryButton = () => {
            this.setState({loadingStatus: status.loading}, this.getVideoDetails)
          }

          const renderVideoDetailedPageFailureView = () => (
            <LoaderBgContainer>
              <FailureViewImage
                src={
                  isDarkTheme
                    ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
                    : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'
                }
                alt="failure view"
              />
              <ErrorText isDarkTheme={isDarkTheme}>
                Oops! Something Went Wrong
              </ErrorText>
              <ErrorDescription>
                We are having some trouble to complete your request. Please try
                again.
              </ErrorDescription>
              <RetryButton type="button" onClick={onClickRetryButton}>
                Retry
              </RetryButton>
            </LoaderBgContainer>
          )

          const renderVideoDetailedView = () =>
            loadingStatus === status.success ? (
              <div>
                {renderVideoPlayer()}
                {renderVideoDetails()}
                <HorizontalLine />
                {renderChannelDetails()}
              </div>
            ) : (
              renderVideoDetailedPageFailureView()
            )

          return (
            <>
              <Header />
              <VideoDetailedBgContainer
                isDarkTheme={isDarkTheme}
                data-testid="videoItemDetails"
              >
                <SideBarMenu />

                <VideoPlayerContainer>
                  {loadingStatus === status.loading
                    ? renderLoader()
                    : renderVideoDetailedView()}
                </VideoPlayerContainer>
              </VideoDetailedBgContainer>
            </>
          )
        }}
      </ThemeAndSavedVideosContext.Consumer>
    )
  }
}

export default VideoDetailsRoute
