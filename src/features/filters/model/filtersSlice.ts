import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type FiltersState = {
  nation: string[]
  type: string[]
  level: number[]
}

const initialState: FiltersState = {
  nation: [],
  type: [],
  level: [],
}

const slice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setNation(state, action: PayloadAction<string[]>) {
      state.nation = action.payload
    },
    setType(state, action: PayloadAction<string[]>) {
      state.type = action.payload
    },
    setLevel(state, action: PayloadAction<number[]>) {
      state.level = action.payload
    },
  },
})

export const { setNation, setType, setLevel } = slice.actions
export default slice.reducer
