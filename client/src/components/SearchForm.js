import React from 'react';
import { connect } from 'react-redux';

import {
  fetchFilterOptions,
  updateSearch,
  fetchQuestions,
} from '../actions/actions';

import { Grid, Input,
  Button, Divider, Container,
  Loader
} from 'semantic-ui-react';

import SearchDropDown from './SearchDropDown';

class SearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.renderSearchOptions = this.renderSearchOptions.bind(this);
    this.handleInputKeyPress = this.handleInputKeyPress.bind(this);
  }

  componentWillMount() {
    const p = this.props;
    if (!p.search.filterOptions) {
      p.dispatch(fetchFilterOptions());
    }
  }

  renderSearchOptions() {
    const f = this.props.search.filterOptions;
    return <Grid columns='equal' textAlign='center'>
      <SearchDropDown name='Category'
                      filter='category'
                      options={f.category.map(c => ({
                        text: c.name, value: c.id
                      }))}/>
      <SearchDropDown name='Search Type'
                      filter='search_type'
                      options={f.search_type.map(c => ({
                        text: c, value: c
                      }))}/>
      <SearchDropDown name='Difficulty'
                      filter='difficulty'
                      options={f.difficulty.map(c => ({
                        text: `${c.number} (${c.title})`, value: c.name
                      }))}/>
      <SearchDropDown name='Subcategory'
                      filter='subcategory'
                      options={f.subcategory.map(c => ({
                        text: c.name, value: c.id
                      }))}/>
      <SearchDropDown name='Question Type'
                      filter='question_type'
                      options={f.question_type.map(c => ({
                        text: c, value: c
                      }))}/>
      <SearchDropDown name='Tournament'
                      filter='tournament'
                      options={f.tournament.map(c => ({
                        text: c.name, value: c.id
                      }))}/>

    </Grid>;
  }

  handleInputKeyPress(e) {
    if (e.key === "Enter") {
      this.triggerSearch();
    }
  }

  triggerSearch() {
    const p = this.props;
    p.dispatch(fetchQuestions(p.search.query, p.search.filters));
  }

  render() {
    let isStacked = this.props.browser.lessThan.medium;
    let buttonGroupProps = {
      size: 'huge',
      compact: true
    };
    if (!isStacked) {
      buttonGroupProps.floated = 'right';
    }

    return <div className="search"><Container>
      <Grid stackable columns={2} textAlign={"center"}
            verticalAlign='middle'>
        {/* Search input */}
        <Grid.Column width={9}>
          <Input fluid size='huge' width={9}
            placeholder={"Search for questions here!"}
            onChange={(e, data) => this.props.dispatch(updateSearch(data.value))}
            onKeyPress={(e) => this.handleInputKeyPress(e)}
          />
        </Grid.Column>
        {/* Search buttons */}
        <Grid.Column width={7} floated='right'>
          <Button.Group {...buttonGroupProps}>
            <Button attached='left' icon='search' content='Search'
                    onClick={this.triggerSearch}
                    onSubmit={this.triggerSearch}
            />
            <Button attached='right' icon='random' content='Random' />
          </Button.Group>
        </Grid.Column>
      </Grid>

      <Divider section/>

      {this.props.search.filterOptions ?
        this.renderSearchOptions() :
        <Loader active inline='centered' size='huge'
          content='Loading Search Options'/>
      }

    </Container></div>
  }
}

const mapStateToProps = state => {
  return {
    search: state.search,
    browser: state.browser
  }
}
SearchForm = connect(
  mapStateToProps
)(SearchForm)

export default SearchForm;
