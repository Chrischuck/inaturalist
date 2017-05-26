import inatjs from "inaturalistjs";
import _ from "lodash";

import { SHOW_CURRENT_OBSERVATION } from "../actions/current_observation_actions";

const RESET = "observations-identify/suggestions/RESET";
const START_LOADING = "observations-identify/suggestions/START_LOADING";
const STOP_LOADING = "observations-identify/suggestions/STOP_LOADING";
const SET_QUERY = "observations-identify/suggestions/SET_QUERY";
const SET_SUGGESTIONS = "observations-identify/suggestions/SET_SUGGESTIONS";
const SET_DETAIL_TAXON = "observations-identify/suggestions/SET_DETAIL_TAXON";

export default function reducer(
  state = {
    query: {},
    loading: false,
    response: {
      results: []
    },
    detailTaxon: null,
    detailPhotoIndex: 0
  },
  action
) {
  let newState = Object.assign( {}, state );
  switch ( action.type ) {
    case RESET:
      newState = {};
      break;
    case START_LOADING:
      newState.loading = true;
      newState.response.results = [];
      newState.detailTaxon = null;
      break;
    case STOP_LOADING:
      newState.loading = false;
      break;
    case SET_QUERY:
      newState.query = action.query || {};
      break;
    case SET_SUGGESTIONS:
      newState.response = action.suggestions;
      newState.detailTaxon = null;
      break;
    case SET_DETAIL_TAXON:
      newState.detailTaxon = action.taxon;
      if ( action.options ) {
        newState.detailPhotoIndex = action.options.detailPhotoIndex;
      }
      break;
    case SHOW_CURRENT_OBSERVATION:
      newState.query = {};
      newState.detailTaxon = null;
      newState.detailPhotoIndex = 0;
      break;
    default:
      // leave it alone
  }
  return newState;
}

function setSuggestions( suggestions ) {
  return { type: SET_SUGGESTIONS, suggestions };
}

function setQuery( query ) {
  return { type: SET_QUERY, query };
}

function startLoading( ) {
  return { type: START_LOADING };
}

function stopLoading( ) {
  return { type: STOP_LOADING };
}

export function updateQuery( query ) {
  return ( dispatch, getState ) => {
    const s = getState( );
    const newQuery = Object.assign( { }, s.suggestions.query, query );
    if ( query.place && !query.place_id ) {
      newQuery.place_id = query.place.id;
    }
    if ( query.taxon && !query.taxon_id ) {
      newQuery.taxon_id = query.taxon.id;
    }
    if (
      query.taxon_id &&
      !query.taxon &&
      s.currentObservation.observation &&
      s.currentObservation.observation.taxon &&
      s.currentObservation.observation.taxon.id === query.taxon_id
    ) {
      newQuery.taxon = s.currentObservation.observation.taxon;
    }
    if ( query.taxon_id && !query.taxon ) {
      inatjs.taxa.fetch( query.taxon_id )
        .then( response => {
          if ( response.results[0] ) {
            dispatch( updateQuery( {
              taxon: response.results[0],
              defaultTaxon: response.results[0]
            } ) );
          }
        } );
    }
    if ( query.place_id && !query.place ) {
      inatjs.places.fetch( query.place_id )
        .then( response => {
          if ( response.results[0] ) {
            dispatch( updateQuery( {
              place: response.results[0],
              defaultPlace: response.results[0]
            } ) );
          }
        } );
    }
    dispatch( setQuery( newQuery ) );
  };
}

export function setDetailTaxon( taxon, options = {} ) {
  return { type: SET_DETAIL_TAXON, taxon, options };
}

export function fetchSuggestions( query ) {
  return function ( dispatch, getState ) {
    const s = getState( );
    let newQuery = {};
    if ( query && _.keys( query ).length > 0 ) {
      newQuery = query;
    } else if ( s.suggestions.query && _.keys( s.suggestions.query ).length > 0 ) {
      newQuery = s.suggestions.query;
    } else {
      const observation = s.currentObservation.observation;
      if ( observation.taxon ) {
        if ( observation.taxon.rank_level === 10 ) {
          newQuery.taxon_id = observation.taxon.ancestor_ids[observation.taxon.ancestor_ids.length - 2];
        } else if ( observation.taxon.rank_level < 10 ) {
          newQuery.taxon_id = observation.taxon.ancestor_ids[observation.taxon.ancestor_ids.length - 3];
        } else {
          newQuery.taxon_id = observation.taxon.id;
        }
      }
      if ( observation.places ) {
        const place = _
          .sortBy( observation.places, p => ( p.ancestor_place_ids || [] ).length * -1 )
          .find( p => p.admin_level );
        newQuery.place_id = place.id;
        newQuery.place = place;
      } else if ( observation.place_ids && observation.place_ids.length > 0 ) {
        newQuery.place_id = observation.place_ids[observation.place_ids.length - 1];
      }
    }
    dispatch( updateQuery( newQuery ) );
    dispatch( startLoading( ) );
    return inatjs.taxa.suggest( newQuery ).then( suggestions => {
      dispatch( stopLoading( ) );
      dispatch( setSuggestions( suggestions ) );
    } );
  };
}
