import {MdClose} from 'react-icons/md'

import {
  PremiumBgContainer,
  PremiumLogo,
  CloseIconContainer,
  PremiumText,
  GetItNowButton,
} from './styledComponents'

const PremiumPlanBanner = props => {
  const {closeBanner} = props
  const onClickClose = () => {
    closeBanner()
  }
  return (
    <PremiumBgContainer data-testid="banner">
      <div>
        <PremiumLogo
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
          alt="nxt watch logo"
        />
        <PremiumText>Buy Nxt Watch Premium prepaid plans with UPI</PremiumText>
        <GetItNowButton>GET IT NOW</GetItNowButton>
      </div>
      <CloseIconContainer
        type="button"
        onClick={onClickClose}
        data-testid="close"
      >
        <MdClose />
      </CloseIconContainer>
    </PremiumBgContainer>
  )
}

export default PremiumPlanBanner
