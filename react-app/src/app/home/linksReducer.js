import {FETCH_LINKS_PENDING, FETCH_LINKS_SUCCESS, FETCH_LINKS_ERROR} from './linksActions';

const initialState = {
    pending: false,
    data: [],
    error: null
}

export function linksReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_LINKS_PENDING:   
            return {
         
                pending: true
            }
        case FETCH_LINKS_SUCCESS:

            return {
               
                pending: false,
                data: action.data
            }
        case FETCH_LINKS_ERROR:
            return {
                pending: false,
                error: action.error
            }
        default: 
            return state;
    }
}

export const getLinks = state => state;
export const getLinksPending = state => state.pending;
export const getLinksError = state => state.error;

export default linksReducer;