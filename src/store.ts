import {createStore, Store, useStore} from 'vuex'

export type StoreState = {
  maxWidth: number;
}

export enum LayoutNum {
  Mobile = 0,
  Tablet = 1,
  Desktop = 2
}

export enum LayoutType {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop'
}

const layoutNum2Type: Record<LayoutNum, LayoutType> = {
  [LayoutNum.Mobile]: LayoutType.Mobile,
  [LayoutNum.Tablet]: LayoutType.Tablet,
  [LayoutNum.Desktop]: LayoutType.Desktop
}

export type StoreGetters = {
  layoutNum: LayoutNum;
  layout: LayoutType;
}

export const MUTATION_SET_MAX_WIDTH: string = 'setMaxWidth';

export const getStore = (): Store<StoreState> => useStore();

const store: Store<StoreState> = createStore<StoreState>({
  state () {
    return {
      maxWidth: window.innerWidth,
    }
  },
  mutations: {
    [MUTATION_SET_MAX_WIDTH]: (state: StoreState, newWidth: number) =>{
      state.maxWidth = newWidth
    }
  },
  getters: {
    layoutNum(state: StoreState): LayoutNum {
      return state.maxWidth < 600 ? LayoutNum.Mobile : state.maxWidth < 840 ? LayoutNum.Tablet : LayoutNum.Desktop
    },
    layout(state: StoreState, getters: StoreGetters): LayoutType {
      return layoutNum2Type[getters.layoutNum]
    }
  }
})
export default store