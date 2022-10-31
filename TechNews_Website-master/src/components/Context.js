import React from "react";
import { useReducer, useContext, useEffect } from "react";
import reducer from "./Reducer";

const AppContext = React.createContext();

const initialState = {
    isLoading: true,
    query: "",
    nbPages: 0,
    page: 0,
    hits: []
}

// create a provider function
const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    let API = "https://hn.algolia.com/api/v1/search?";

    const fetchApiData = async(url) => {

        dispatch({type: "SET_LOADING"});

        try {
            const res = await fetch(url);
            const data = await res.json();
            dispatch({
                type: "GET_STORIES",
                payload: {
                    hits: data.hits,
                    nbPages: data.nbPages
                }
        });
        } catch(error) {
            console.log(error);
        }
    }

    // delete post
    const removePost = (id) => {
        dispatch({ type: "REMOVE_POST", payload: id })
    };

    // search function
    const searchPost = (searchQuery) => {
        dispatch({ type: "SEARCH_QUERY", payload: searchQuery})
    }

    // pagination
    const getNextPage = () => {
        dispatch({
            type: "NEXT_PAGE"
        })
    }

    const getPrevPage = () => {
        dispatch({
            type: "PREV_PAGE"
        })
    }

    // Api call function
    useEffect(() => {
        fetchApiData(`${API}query=${state.query}&page=${state.page}`);
    }, [state.query, state.page])

    return (
    <AppContext.Provider value={{...state, removePost, searchPost, getNextPage, getPrevPage}}>
        {children}
    </AppContext.Provider>
    );
}

// create a custom hook
const useGlobalContext = () => {
    return useContext(AppContext);
}

export {AppContext, AppProvider, useGlobalContext};