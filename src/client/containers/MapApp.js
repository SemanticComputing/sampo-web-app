import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import Paper from '@material-ui/core/Paper';
import Immutable from 'immutable';
import VirtualizedTable from '../components/VirtualizedTable';
import LeafletMap from '../components/map/LeafletMap';
import GMap from '../components/map/GMap';
import Pie from '../components/Pie';
import NavTabs from '../components/NavTabs';

import {
  getVisibleResults,
  getVisibleValues
} from '../selectors';

import {
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  clearResults,
  openAnalysisView,
  closeAnalysisView,
  getGeoJSON,
  updateResultFormat,
  updateResultsFilter,
  sortResults,
} from '../actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appFrame: {
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
    minWidth: 640,
    minHeight: 700
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    marginTop: 64,
    height: 'calc(100% - 64px)',
    boxSizing: 'border-box',
    borderBottom: '5px solid' + theme.palette.primary.main,
    borderRight: '5px solid' + theme.palette.primary.main,
    borderLeft: '5px solid' + theme.palette.primary.main,
  },
  resultTable: {
    width: 1024,
    height: '100%',
    borderRight: '5px solid' + theme.palette.primary.main,
    borderRadius: 0,
  },
  resultTableOneColumn: {
    width: 1024,
    height: '100%',
  },
  rightColumn: {
    height: '100%',
    width: 'calc(100% - 1024px)',
  },
  map: {
    width: '100%',
    height: '50%',
    borderBottom: '5px solid' + theme.palette.primary.main,
  },
  statistics: {
    width: '100%',
    height: '50%',
  }
});

let MapApp = (props) => {
  const { classes, error, analysisView, heatMap, browser } = props;

  let oneColumnView = true;
  if (browser.greaterThan.extraLarge) {
    oneColumnView = false;
  }

  let map = '';
  if (heatMap) {
    map = (
      <GMap
        results={props.results}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKWw5FjhwLsfp_l2gjVAifPkT3cxGXhA4&v=3.exp&libraries=geometry,drawing,places,visualization"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  } else {
    map = (
      <LeafletMap
        sliderValue={100}
        results={props.results}
        geoJSON={props.geoJSON}
        geoJSONKey={props.geoJSONKey}
        getGeoJSON={props.getGeoJSON}
        analysisView={props.analysisView}
      />
    );
  }
  //

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar position="absolute">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              NameSampo
            </Typography>
            {oneColumnView && <NavTabs /> }
          </Toolbar>

        </AppBar>
        <div className={classes.mainContainer}>
          <div className={oneColumnView ? classes.resultTableOneColumn : classes.resultTable}>
            <VirtualizedTable
              list={Immutable.List(props.results)}
              resultValues={props.resultValues}
              search={props.search}
              sortResults={props.sortResults}
              toggleDataset={props.toggleDataset}
              updateResultsFilter={props.updateResultsFilter}
              updateQuery={props.updateQuery}
              fetchResults={props.fetchResults}
              clearResults={props.clearResults}
              fetchSuggestions={props.fetchSuggestions}
              clearSuggestions={props.clearSuggestions}
              updateResultFormat={props.updateResultFormat}
              analysisView={props.analysisView}
            />
          </div>
          {!oneColumnView &&
            <div className={classes.rightColumn}>
              <div className={classes.map}>
                {map}
              </div>
              <div className={classes.statistics}>
                <Pie data={props.results} groupBy={props.search.groupBy} query={props.search.query} />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    search: state.search,
    results: getVisibleResults(state.search),
    resultValues: getVisibleValues(state.search),
    analysisView: state.options.analysisView,
    heatMap: state.options.heatMap,
    error: state.error,
    geoJSON: state.map.geoJSON,
    geoJSONKey: state.map.geoJSONKey,
    resultFormat: state.options.resultFormat,
    browser: state.browser
  };
};

const mapDispatchToProps = ({
  openAnalysisView,
  closeAnalysisView,
  updateQuery,
  toggleDataset,
  fetchSuggestions,
  clearSuggestions,
  fetchResults,
  clearResults,
  sortResults,
  getGeoJSON,
  updateResultFormat,
  updateResultsFilter
});

MapApp.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  analysisView: PropTypes.bool.isRequired,
  heatMap: PropTypes.bool.isRequired,
  openAnalysisView: PropTypes.func.isRequired,
  closeAnalysisView: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  toggleDataset: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  geoJSON: PropTypes.object.isRequired,
  geoJSONKey: PropTypes.number,
  getGeoJSON: PropTypes.func.isRequired,
  updateResultFormat: PropTypes.func.isRequired,
  resultFormat: PropTypes.string.isRequired,
  results: PropTypes.array,
  resultValues: PropTypes.object,
  updateResultsFilter: PropTypes.func.isRequired,
  browser: PropTypes.object.isRequired
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withWidth(),
  withStyles(styles, {withTheme: true}),
)(MapApp);
