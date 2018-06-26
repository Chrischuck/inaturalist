import { connect } from "react-redux";
import App from "../components/app";
import { setSelectedTab, subscribe, join, leave, convertProject } from "../ducks/project";

function mapStateToProps( state ) {
  return {
    config: state.config,
    project: state.project
  };
}

function mapDispatchToProps( dispatch ) {
  return {
    convertProject: ( ) => dispatch( convertProject( ) ),
    setSelectedTab: tab => dispatch( setSelectedTab( tab ) ),
    subscribe: ( ) => dispatch( subscribe( ) ),
    join: ( ) => dispatch( join( ) ),
    leave: ( ) => dispatch( leave( ) )
  };
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)( App );

export default AppContainer;
