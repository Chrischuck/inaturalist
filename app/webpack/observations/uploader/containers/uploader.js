import { connect } from "react-redux";
import DragDropZone from "../components/drag_drop_zone";
import actions from "../actions/actions";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import { createSavedLocation, removeSavedLocation } from "../ducks/saved_locations";

const mapStateToProps = ( state ) => {
  return Object.assign(
    {},
    state.dragDropZone,
    { savedLocations: state.savedLocations }
  );
};

const mapDispatchToProps = ( dispatch ) => ( {
  onDrop: ( droppedFiles, rejectedFiles, e ) => {
    if ( rejectedFiles.length > 0 ) {
      dispatch( actions.onRejectedFiles( rejectedFiles ) );
    }
    dispatch( actions.onFileDrop( droppedFiles, e ) );
  },
  onCardDrop: ( droppedFiles, e, obsCard ) => {
    dispatch( actions.onFileDropOnCard( droppedFiles, e, obsCard ) );
  },
  updateObsCard: ( obsCard, updates ) => {
    dispatch( actions.updateObsCard( obsCard, updates ) );
  },
  updateSelectedObsCards: ( updates ) => {
    dispatch( actions.updateSelectedObsCards( updates ) );
  },
  removeObsCard: ( obsCard ) => {
    dispatch( actions.removeObsCard( obsCard ) );
  },
  removeSelected: ( ) => {
    dispatch( actions.removeSelected( ) );
  },
  selectAll: ( ) => {
    dispatch( actions.selectAll( ) );
  },
  trySubmitObservations: ( ) => {
    dispatch( actions.trySubmitObservations( ) );
  },
  createBlankObsCard: ( ) => {
    dispatch( actions.createBlankObsCard( ) );
  },
  selectObsCards: ( ids ) => {
    dispatch( actions.selectObsCards( ids ) );
  },
  mergeObsCards: ( obsCards, targetCard ) => {
    dispatch( actions.mergeObsCards( obsCards, targetCard ) );
  },
  setState: ( attrs ) => {
    dispatch( actions.setState( attrs ) );
  },
  updateState: ( attrs ) => {
    dispatch( actions.updateState( attrs ) );
  },
  confirmRemoveSelected: ( ) => {
    dispatch( actions.confirmRemoveSelected( ) );
  },
  confirmRemoveObsCard: ( obsCard ) => {
    dispatch( actions.confirmRemoveObsCard( obsCard ) );
  },
  movePhoto: ( photo, toObsCard ) => {
    dispatch( actions.movePhoto( photo, toObsCard ) );
  },
  newCardFromMedia: ( media ) => {
    dispatch( actions.newCardFromMedia( media ) );
  },
  combineSelected: ( ) => {
    dispatch( actions.combineSelected( ) );
  },
  confirmRemoveFile: ( file ) => {
    dispatch( actions.confirmRemoveFile( file ) );
  },
  appendToSelectedObsCards: ( updates ) => {
    dispatch( actions.appendToSelectedObsCards( updates ) );
  },
  removeFromSelectedObsCards: ( updates ) => {
    dispatch( actions.removeFromSelectedObsCards( updates ) );
  },
  saveLocation: params => {
    dispatch( createSavedLocation( params ) );
  },
  removeSavedLocation: savedLocation => dispatch( removeSavedLocation( savedLocation ) )
} );

/* eslint new-cap: [2, { capIsNewExceptions: ["DragDropContext"] }] */
const Uploader = connect(
  mapStateToProps,
  mapDispatchToProps
)( DragDropContext( HTML5Backend )( DragDropZone ) );

export default Uploader;
