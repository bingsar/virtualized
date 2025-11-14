import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type SearchState = { q: string }

const initialState: SearchState = { q: '' }

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQ(state, action: PayloadAction<string>) {
      state.q = action.payload
    },
    clear(state) {
      state.q = ''
    },
  },
})

export const { setQ, clear } = slice.actions
export default slice.reducer
