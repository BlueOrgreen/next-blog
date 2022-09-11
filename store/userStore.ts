export type IUserInfo = {
  id?: number | null,
  userId?: number | null,
  nickname?: string,
  avator?: string,
}

export interface IUserStore {
  userInfo: IUserInfo,
  setUserInfo: (value: IUserInfo) => void
}

const userStore = (): IUserStore => {
  return {
    userInfo: {},
    setUserInfo: function(value) {
      this.userInfo = value;
    }
  }
}

export default userStore;