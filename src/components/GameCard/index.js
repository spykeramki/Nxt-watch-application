import {
  GameCardBgContainer,
  GameCardImage,
  GameCardVideoTitle,
  GameCardVideoCount,
  LinkToRoute,
} from './styledComponents'

const GameCard = props => {
  const {videoCard, isDarkTheme} = props
  const {id, title, thumbnailUrl, viewCount} = videoCard
  return (
    <LinkToRoute to={`/videos/${id}`}>
      <GameCardBgContainer>
        <GameCardImage src={thumbnailUrl} alt="video thumbnail" />
        <GameCardVideoTitle isDarkTheme={isDarkTheme}>
          {title}
        </GameCardVideoTitle>
        <GameCardVideoCount>{viewCount} Watching Worldwide</GameCardVideoCount>
      </GameCardBgContainer>
    </LinkToRoute>
  )
}

export default GameCard
