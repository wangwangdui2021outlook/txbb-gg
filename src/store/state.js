import { getToken, getUserInfo } from '../util/userAuth'

const state = {
  token: getToken(),
  userInfo: getUserInfo() ? JSON.parse(getUserInfo()) : {},
  asyncMenuList: []
}

export default state
