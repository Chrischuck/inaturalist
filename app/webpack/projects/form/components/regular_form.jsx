import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import DateTimeFieldWrapper from
  "../../../observations/uploader/components/date_time_field_wrapper";
import JQueryUIMultiselect from "../../../observations/identify/components/jquery_ui_multiselect";
import TaxonSelector from "./taxon_selector";
import PlaceSelector from "./place_selector";
import UserSelector from "./user_selector";
import ProjectSelector from "./project_selector";

class RegularForm extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      inverseFiltersOpen: false
    };
  }

  setCaptive( ) {
    const { setRulePreference } = this.props;
    const wildChecked = $( "input[name=wild]:checked", ReactDOM.findDOMNode( this ) ).length;
    const captiveChecked = $( "input[name=captive]:checked", ReactDOM.findDOMNode( this ) ).length;
    let captiveParamValue = null;
    if ( wildChecked && !captiveChecked ) {
      captiveParamValue = "false";
    }
    if ( !wildChecked && captiveChecked ) {
      captiveParamValue = "true";
    }
    console.log( ["Captive", wildChecked, captiveChecked, captiveParamValue] );
    setRulePreference( "captive", captiveParamValue );
  }

  setQualityGrade( ) {
    const { setRulePreference } = this.props;
    setRulePreference( "quality_grade", this.qualityGradeValues( ) );
  }

  qualityGradeValues( ) {
    const checkedInputs = $( "input[name=quality_grade]:checked", ReactDOM.findDOMNode( this ) );
    return _.map( checkedInputs, a => a.value ).join( "," ) || null;
  }

  render( ) {
    const {
      project,
      setRulePreference,
      updateProject,
      allControlledTerms
    } = this.props;
    const monthNames = ( "january february march april may june july august "
      + "september october november december" ).split( " " );
    const inverseFilterCount = _.size( project.notTaxonRules )
      + _.size( project.notPlaceRules ) + _.size( project.notUserRules )
      + _.size( project.notProjectRules );
    const chosenTerm = project.rule_term_id
      ? allControlledTerms.find( t => t.id === _.toInteger( project.rule_term_id ) )
      : null;
    const qualityEmpty = _.isEmpty( project.rule_quality_grade );
    const captiveEmpty = _.isEmpty( project.rule_captive );
    return (
      <div id="RegularForm" className="Form" key={ project.previewSearchParamsString }>
        <Grid>
          <Row className="text">
            <Col xs={ 12 }>
              <h2>{ I18n.t( "observation_requirements" ) }</h2>
              <div className="help-text">
                { I18n.t( "views.projects.new.please_specify_the_requirements" ) }
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={ 12 } className="autocompletes">
              <Row>
                <Col xs={ 4 }>
                  <TaxonSelector { ...this.props } />
                </Col>
                <Col xs={ 4 }>
                  <PlaceSelector { ...this.props } />
                </Col>
              </Row>
              <Row>
                <Col xs={ 4 }>
                  <UserSelector { ...this.props } />
                </Col>
                <Col xs={ 4 }>
                  <ProjectSelector { ...this.props } />
                </Col>
              </Row>
              <label className="inverse-toggle collapsible"
                onClick={ ( ) => {
                  this.setState( { inverseFiltersOpen: !this.state.inverseFiltersOpen } );
                } }
              >
                { I18n.t( "exclusion_filters" ) }
                { inverseFilterCount > 0 && ` (${inverseFilterCount})` }
                <i
                  className={
                    `fa fa-chevron-circle-${this.state.inverseFiltersOpen ? "down" : "right"}`
                  }
                />
              </label>
              <Panel
                className="inverse"
                expanded={ this.state.inverseFiltersOpen }
                onToggle={ () => {} }
              >
                <Panel.Collapse>
                  <Row>
                    <Col xs={ 4 }>
                      <TaxonSelector { ...this.props } inverse />
                    </Col>
                    <Col xs={ 4 }>
                      <PlaceSelector { ...this.props } inverse />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={ 4 }>
                      <UserSelector { ...this.props } inverse />
                    </Col>
                    <Col xs={ 4 }>
                      <ProjectSelector { ...this.props } inverse />
                    </Col>
                  </Row>
                </Panel.Collapse>
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col xs={ 6 }>
              <div className="form-group annotations-form-group">
                <label className="sectionlabel">{ I18n.t( "with_annotation" ) }</label>
                <select
                  id="project-term-id"
                  className={ "form-control" }
                  value={ project.rule_term_id }
                  onChange={ e => {
                    if ( _.isEmpty( e.target.value ) ) {
                      setRulePreference( "term_id", null );
                    } else {
                      setRulePreference( "term_id", e.target.value );
                    }
                  } }
                >
                  <option value="">
                    { I18n.t( "none" ) }
                  </option>
                  { allControlledTerms.map( t => (
                    <option value={ t.id } key={`with-term-id-${t.id}`}>
                      { I18n.t( `controlled_term_labels.${_.snakeCase( t.label )}`, { default: t.label } ) }
                    </option>
                  ) ) }
                </select>
                { chosenTerm ? (
                  <div className="term-value">
                    <big>=</big>
                    <select
                      id="project-term-value-id"
                      className={ "form-control" }
                      value={ project.rule_term_value_id }
                      onChange={ e => {
                        if ( _.isEmpty( e.target.value ) ) {
                          setRulePreference( "term_value_id", null );
                        } else {
                          setRulePreference( "term_value_id", e.target.value );
                        }
                      } }
                    >
                      <option value="">
                        { I18n.t( "any_" ) }
                      </option>
                      { chosenTerm.values.map( t => (
                        <option value={ t.id } key={`annotation-term-value-id-${t.id}`}>
                          { I18n.t( `controlled_term_labels.${_.snakeCase( t.label )}`, { default: t.label } ) }
                        </option>
                      ) ) }
                    </select>
                  </div>
                ) : null }
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={ 12 }>
              <label>{ I18n.t( "data_quality" ) }</label>
              <input
                type="checkbox"
                id="project-quality-research"
                name="quality_grade"
                value="research"
                defaultChecked={ project.rule_quality_grade.research || qualityEmpty }
                onChange={ ( ) => this.setQualityGrade( ) }
              />
              <label className="inline" htmlFor="project-quality-research">
                { I18n.t( "research_" ) }
              </label>
              <input
                type="checkbox"
                id="project-quality-needs-id"
                name="quality_grade"
                value="needs_id"
                defaultChecked={ project.rule_quality_grade.needs_id || qualityEmpty }
                onChange={ ( ) => this.setQualityGrade( ) }
              />
              <label className="inline" htmlFor="project-quality-needs-id">
                { I18n.t( "needs_id_" ) }
              </label>
              <input
                type="checkbox"
                id="project-quality-casual"
                name="quality_grade"
                value="casual"
                defaultChecked={ project.rule_quality_grade.casual || qualityEmpty }
                onChange={ ( ) => this.setQualityGrade( ) }
              />
              <label className="inline" htmlFor="project-quality-casual">
                { I18n.t( "casual_" ) }
              </label>
            </Col>
          </Row>
          <Row>
            <Col xs={ 12 }>
              <label>{ I18n.t( "media_type" ) }</label>
              <input
                type="checkbox"
                id="project-media-photos"
                name="photos"
                defaultChecked={ project.rule_photos }
                onChange={ e => setRulePreference( "photos", e.target.checked ? "true" : null ) }
              />
              <label className="inline" htmlFor="project-media-photos">
                { I18n.t( "has_photos" ) }
              </label>
              <input
                type="checkbox"
                id="project-media-sounds"
                name="sounds"
                defaultChecked={ project.rule_sounds }
                onChange={ e => setRulePreference( "sounds", e.target.checked ? "true" : null ) }
              />
              <label className="inline" htmlFor="project-media-sounds">
                { I18n.t( "has_sounds" ) }
              </label>
            </Col>
          </Row>
          <Row>
            <Col xs={ 12 }>
              <label>{ I18n.t( "captive_cultivated" ) }</label>
              <input
                type="checkbox"
                id="project-wild"
                name="wild"
                defaultChecked={ project.rule_captive === "false" || captiveEmpty }
                onChange={ e => this.setCaptive( ) }
              />
              <label className="inline" htmlFor="project-wild">
                { I18n.t( "wild" ) }
              </label>
              <input
                type="checkbox"
                id="project-captive"
                name="captive"
                defaultChecked={ project.rule_captive === "true" || captiveEmpty }
                onChange={ e => this.setCaptive( ) }
              />
              <label className="inline" htmlFor="project-captive">
                { I18n.t( "captive" ) }
              </label>
            </Col>
          </Row>
          <Row className="date-row">
            <Col xs={ 12 }>
              <label>{ I18n.t( "date_observed_" ) }</label>
              <input
                type="radio"
                id="project-date-type-any"
                checked={ project.date_type === "any" }
                onChange={ ( ) => updateProject( { date_type: "any" } ) }
              />
              <label className="inline" htmlFor="project-date-type-any">
                { I18n.t( "any_" ) }
              </label>
              <input
                type="radio"
                id="project-date-type-exact"
                checked={ project.date_type === "exact" }
                onChange={ ( ) => updateProject( { date_type: "exact" } ) }
              />
              <label className="inline" htmlFor="project-date-type-exact">
                { I18n.t( "exact" ) }
              </label>
              <DateTimeFieldWrapper
                mode="date"
                ref="exactDate"
                inputFormat="YYYY-MM-DD"
                defaultText={ project.rule_observed_on }
                onChange={ date => setRulePreference( "observed_on", date ) }
                allowFutureDates
                inputProps={ {
                  className: "form-control",
                  placeholder: "YYYY-MM-DD",
                  onClick: ( ) => this.refs.exactDate.onClick( )
                } }
              />
            </Col>
          </Row>
          <Row className="date-row">
            <Col xs={12} className="date-range-col">
              <input
                type="radio"
                id="project-date-type-range"
                checked={ project.date_type === "range" }
                onChange={ ( ) => updateProject( { date_type: "range" } ) }
              />
              <label className="inline" htmlFor="project-date-type-range">
                { I18n.t( "date_picker.range" ) }
              </label>
              <DateTimeFieldWrapper
                mode="datetime"
                ref="dateRangeD1"
                inputFormat="YYYY-MM-DD HH:mm Z"
                defaultText={ project.rule_d1 }
                onChange={ date => setRulePreference( "d1", date ) }
                allowFutureDates
                inputProps={ {
                  className: "form-control",
                  placeholder: I18n.t( "start_date_time" ),
                  onClick: ( ) => this.refs.dateRangeD1.onClick( )
                } }
              />
              <DateTimeFieldWrapper
                mode="datetime"
                ref="dateRangeD2"
                inputFormat="YYYY-MM-DD HH:mm Z"
                defaultText={ project.rule_d2 }
                onChange={ date => setRulePreference( "d2", date ) }
                allowFutureDates
                inputProps={ {
                  className: "form-control",
                  placeholder: I18n.t( "end_date_time" ),
                  onClick: ( ) => this.refs.dateRangeD2.onClick( )
                } }
              />
              <div className="help-text">
                { I18n.t( "views.projects.new.note_you_can_delete_the_time" ) }
              </div>
            </Col>
          </Row>
          <Row className="date-row">
            <Col xs={12}>
              <input
                type="radio"
                id="project-date-type-months"
                checked={ project.date_type === "months" }
                onChange={ ( ) => updateProject( { date_type: "months" } ) }
              />
              <label className="inline" htmlFor="project-date-type-months">
                { I18n.t( "months" ) }
              </label>
              <div
                style={ { position: "relative" } }
              >
                <JQueryUIMultiselect
                  className="form-control input-sm"
                  id="filters-dates-month"
                  onChange={ values =>
                    setRulePreference( "month", values ? values.join( "," ) : null )
                  }
                  defaultValue={ project.rule_month ? project.rule_month.split( "," ) : [] }
                  data={
                    _.map( monthNames, ( month, i ) => (
                      {
                        value: i + 1,
                        label: I18n.t( `date_format.month.${month}` )
                      }
                    ) )
                  }
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

RegularForm.propTypes = {
  config: PropTypes.object,
  project: PropTypes.object,
  allControlledTerms: PropTypes.array,
  addProjectRule: PropTypes.func,
  removeProjectRule: PropTypes.func,
  setRulePreference: PropTypes.func,
  updateProject: PropTypes.func
};

export default RegularForm;
